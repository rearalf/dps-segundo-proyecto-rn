import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, Spacing } from "@/constants/theme";
import { IEventItem } from "@/interfaces/IEvents";
import { db } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";

const eventsCollection = collection(db, "events");
const commentsCollection = collection(db, "comments");

const resolveIsPast = (date: string, time: string, status: string) => {
  if (status === "Evento pasado") return true;
  const eventDate = new Date(`${date}T${time}:00`);
  if (Number.isNaN(eventDate.getTime())) return false;
  return eventDate < new Date();
};

const mapEvent = (
  eventId: string,
  data: Record<string, unknown>,
): IEventItem => ({
  id: eventId,
  title: String(data.title ?? ""),
  date: String(data.date ?? ""),
  time: String(data.time ?? ""),
  location: String(data.location ?? ""),
  description: String(data.description ?? ""),
  status: String(data.status ?? "Abierto para inscripciones"),
  isPast:
    typeof data.isPast === "boolean"
      ? data.isPast
      : resolveIsPast(
          String(data.date ?? ""),
          String(data.time ?? ""),
          String(data.status ?? "Abierto para inscripciones"),
        ),
  attendees: Array.isArray(data.attendees) ? (data.attendees as string[]) : [],
});

export default function EventsTabScreen() {
  const user = useAuthSessionStore((state) => state.user);

  const [events, setEvents] = useState<IEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attendingLoading, setAttendingLoading] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());

  // Modal de comentario
  const [commentModalEvent, setCommentModalEvent] = useState<IEventItem | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const q = query(eventsCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((d) =>
        mapEvent(d.id, d.data() as Record<string, unknown>),
      );
      setEvents(loaded);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? events[0],
    [events, selectedEventId],
  );

  const upcomingEvents = events.filter((e) => !e.isPast);
  const pastEvents = events.filter((e) => e.isPast);

  const fillForm = (event: IEventItem) => {
    setEditingId(event.id);
    setSelectedEventId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setDescription(event.description);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !date.trim() || !time.trim() || !location.trim()) return;
    const normalizedIsPast = resolveIsPast(date.trim(), time.trim(), "Abierto para inscripciones");

    if (editingId) {
      await updateDoc(doc(db, "events", editingId), {
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        isPast: normalizedIsPast,
        updatedAt: Date.now(),
      });
    } else {
      const eventRef = await addDoc(eventsCollection, {
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        isPast: normalizedIsPast,
        attendees: [],
        user: user?.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setSelectedEventId(eventRef.id);
    }
    resetForm();
  };

  const handleDelete = async (eventId: string) => {
    await deleteDoc(doc(db, "events", eventId));
    if (editingId === eventId) resetForm();
  };

  const handleToggleAttendance = async (event: IEventItem) => {
    if (!user?.uid) return;
    setAttendingLoading(event.id);
    const isAttending = event.attendees?.includes(user.uid);
    await updateDoc(doc(db, "events", event.id), {
      attendees: isAttending ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
    setAttendingLoading(null);
  };

  const handleDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setDateObj(selected);
      const yyyy = selected.getFullYear();
      const mm = String(selected.getMonth() + 1).padStart(2, "0");
      const dd = String(selected.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  const handleTimeChange = (_: any, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) {
      const hh = String(selected.getHours()).padStart(2, "0");
      const min = String(selected.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${min}`);
    }
  };

  const openCommentModal = (event: IEventItem) => {
    setCommentModalEvent(event);
    setCommentText("");
    setCommentRating(0);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || commentRating === 0 || !commentModalEvent) return;
    setSubmittingComment(true);
    await addDoc(commentsCollection, {
      eventId: commentModalEvent.id,
      eventTitle: commentModalEvent.title,
      userId: user?.uid,
      user: user?.displayName || user?.email || "Anonimo",
      comment: commentText.trim(),
      rating: commentRating,
      createdAt: Date.now(),
    });
    setSubmittingComment(false);
    setCommentModalEvent(null);
  };

  const renderStars = (count: number, interactive = false) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => interactive && setCommentRating(star)}
          disabled={!interactive}
        >
          <Text style={[styles.star, star <= count && styles.starActive]}>★</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Formulario */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {editingId ? "Actualizar evento" : "Crear evento"}
            </Text>
            <Text style={styles.sectionHint}>
              Completa la informacion principal del evento.
            </Text>
          </View>

          <TextInput
            placeholder="Titulo del evento"
            placeholderTextColor={palette.muted}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <View style={styles.row}>
            <Pressable
              style={[styles.input, styles.rowInput, styles.pickerButton]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={date ? styles.pickerText : styles.pickerPlaceholder}>
                {date || "Fecha"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.input, styles.rowInput, styles.pickerButton]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={time ? styles.pickerText : styles.pickerPlaceholder}>
                {time || "Hora"}
              </Text>
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateObj}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={dateObj}
              mode="time"
              display="default"
              onChange={handleTimeChange}
              is24Hour={true}
            />
          )}

          <TextInput
            placeholder="Ubicacion"
            placeholderTextColor={palette.muted}
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
          <TextInput
            placeholder="Descripcion"
            placeholderTextColor={palette.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, styles.textArea]}
          />

          <View style={styles.formActions}>
            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>
                {editingId ? "Guardar cambios" : "Crear evento"}
              </Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={resetForm}>
              <Text style={styles.secondaryButtonText}>Limpiar</Text>
            </Pressable>
          </View>
        </View>

        {/* Eventos próximos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos proximos</Text>
          <Text style={styles.sectionHint}>
            Toca uno para ver detalles, editarlo o confirmar asistencia.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={palette.primary} />
        ) : (
          <View style={styles.list}>
            {upcomingEvents.length === 0 && (
              <Text style={styles.emptyText}>No hay eventos proximos.</Text>
            )}
            {upcomingEvents.map((event) => {
              const isAttending = event.attendees?.includes(user?.uid ?? "");
              const attendeeCount = event.attendees?.length ?? 0;
              const isLoadingThis = attendingLoading === event.id;

              return (
                <View key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDetail}>
                    {event.location} · {event.date} · {event.time}
                  </Text>
                  {event.description ? (
                    <Text style={styles.eventDetail}>{event.description}</Text>
                  ) : null}
                  <Text style={styles.attendeeCount}>
                    {attendeeCount}{" "}
                    {attendeeCount === 1 ? "persona confirmada" : "personas confirmadas"}
                  </Text>

                  <View style={styles.cardActions}>
                    <Pressable
                      style={[
                        styles.attendButton,
                        isAttending && styles.attendButtonActive,
                      ]}
                      onPress={() => handleToggleAttendance(event)}
                      disabled={isLoadingThis}
                    >
                      {isLoadingThis ? (
                        <ActivityIndicator
                          color={isAttending ? "#fff" : palette.primary}
                          size="small"
                        />
                      ) : (
                        <Text
                          style={[
                            styles.attendButtonText,
                            isAttending && styles.attendButtonTextActive,
                          ]}
                        >
                          {isAttending ? "✓ Asistire" : "Confirmar asistencia"}
                        </Text>
                      )}
                    </Pressable>
                    <Pressable
                      style={styles.cardAction}
                      onPress={() => fillForm(event)}
                    >
                      <Text style={styles.cardActionText}>Editar</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.cardAction, styles.cardActionDanger]}
                      onPress={() => handleDelete(event.id)}
                    >
                      <Text style={[styles.cardActionText, styles.cardActionDangerText]}>
                        Eliminar
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Eventos pasados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos pasados</Text>
          <Text style={styles.sectionHint}>
            Puedes comentar los eventos a los que asististe.
          </Text>
        </View>

        <View style={styles.list}>
          {pastEvents.length === 0 && (
            <Text style={styles.emptyText}>No hay eventos pasados.</Text>
          )}
          {pastEvents.map((event) => {
            const attended = event.attendees?.includes(user?.uid ?? "");
            return (
              <View key={event.id} style={[styles.eventCard, styles.pastCard]}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDetail}>
                  {event.location} · {event.date} · {event.time}
                </Text>
                <Text style={styles.attendeeCount}>
                  {event.attendees?.length ?? 0} asistentes
                </Text>
                {attended && (
                  <View style={styles.cardActions}>
                    <Pressable
                      style={styles.commentButton}
                      onPress={() => openCommentModal(event)}
                    >
                      <Text style={styles.commentButtonText}>
                        ✏️ Dejar comentario
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de comentario */}
      <Modal
        visible={!!commentModalEvent}
        transparent
        animationType="slide"
        onRequestClose={() => setCommentModalEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Comentar evento</Text>
            <Text style={styles.modalEventName}>
              {commentModalEvent?.title}
            </Text>

            <Text style={styles.label}>Calificacion</Text>
            {renderStars(commentRating, true)}
            {commentRating === 0 && (
              <Text style={styles.ratingHint}>Toca una estrella</Text>
            )}

            <TextInput
              placeholder="Escribe tu comentario..."
              placeholderTextColor={palette.muted}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              style={[styles.input, styles.textArea]}
            />

            <View style={styles.formActions}>
              <Pressable
                style={[
                  styles.primaryButton,
                  (!commentText.trim() || commentRating === 0) && styles.primaryButtonDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={submittingComment || !commentText.trim() || commentRating === 0}
              >
                {submittingComment ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Publicar</Text>
                )}
              </Pressable>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setCommentModalEvent(null)}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg },
  content: { padding: Spacing.four, gap: Spacing.three },
  formCard: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: palette.line,
    gap: Spacing.two,
  },
  sectionTitle: { color: palette.text, fontSize: 18, fontWeight: "800" },
  sectionHeader: { gap: 2 },
  sectionHint: { color: palette.muted, fontSize: 13 },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: palette.line,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    color: palette.text,
    fontSize: 14,
  },
  textArea: { minHeight: 96, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: Spacing.two },
  rowInput: { flex: 1 },
  formActions: { flexDirection: "row", gap: Spacing.two },
  primaryButton: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: palette.primarySoft,
  },
  secondaryButtonText: { color: palette.text, fontSize: 15, fontWeight: "800" },
  list: { gap: Spacing.two },
  emptyText: { color: palette.muted, fontSize: 14, textAlign: "center", paddingVertical: 12 },
  eventCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 6,
  },
  pastCard: { opacity: 0.8 },
  eventTitle: { color: palette.text, fontSize: 17, fontWeight: "700" },
  eventDetail: { color: palette.muted, fontSize: 13, lineHeight: 18 },
  attendeeCount: { color: palette.primary, fontSize: 12, fontWeight: "700", marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 8 },
  attendButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: palette.primary,
    backgroundColor: "#fff",
    minWidth: 60,
    alignItems: "center",
  },
  attendButtonActive: { backgroundColor: palette.primary },
  attendButtonText: { color: palette.primary, fontSize: 12, fontWeight: "700" },
  attendButtonTextActive: { color: "#fff" },
  cardAction: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.primarySoft,
  },
  cardActionText: { color: palette.text, fontSize: 12, fontWeight: "700" },
  cardActionDanger: { backgroundColor: "#F8E5E5" },
  cardActionDangerText: { color: "#9A2F2F" },
  commentButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  commentButtonText: { color: palette.primary, fontSize: 12, fontWeight: "700" },
  pickerButton: { justifyContent: "center" },
  pickerText: { color: palette.text, fontSize: 14 },
  pickerPlaceholder: { color: palette.muted, fontSize: 14 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: palette.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  modalTitle: { color: palette.text, fontSize: 20, fontWeight: "800" },
  modalEventName: { color: palette.primary, fontSize: 14, fontWeight: "700" },
  label: { color: palette.text, fontSize: 14, fontWeight: "600" },
  starsRow: { flexDirection: "row", gap: 4 },
  star: { fontSize: 28, color: palette.line },
  starActive: { color: "#F5A623" },
  ratingHint: { color: palette.muted, fontSize: 12 },
});