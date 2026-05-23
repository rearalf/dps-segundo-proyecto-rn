import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useMemo, useState } from "react";
import {
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

const resolveIsPast = (date: string, status: string) => {
  if (status === "Evento pasado") {
    return true;
  }

  const eventDate = new Date(date);
  if (Number.isNaN(eventDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
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
          String(data.status ?? "Abierto para inscripciones"),
        ),
});

export default function EventsTabScreen() {
  const user = useAuthSessionStore((state) => state.user);

  const [events, setEvents] = useState<IEventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Abierto para inscripciones");

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? events[0],
    [events, selectedEventId],
  );

  const upcomingEvents = events.filter((event) => !event.isPast);
  const pastEvents = events.filter((event) => event.isPast);

  const statusOptions = [
    "Abierto para inscripciones",
    "En seguimiento",
    "Requiere confirmacion",
    "Evento pasado",
  ];

  const fillForm = (event: IEventItem) => {
    setEditingId(event.id);
    setSelectedEventId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setDescription(event.description);
    setStatus(event.status);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
    setStatus("Abierto para inscripciones");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !date.trim() || !time.trim() || !location.trim()) {
      return;
    }

    const normalizedIsPast = resolveIsPast(date.trim(), status);

    if (editingId) {
      await updateDoc(doc(db, "events", editingId), {
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        status,
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
        // status,
        isPast: normalizedIsPast,
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

    if (editingId === eventId) {
      resetForm();
    }
  };

  const openEventForDetails = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const manageActions = [
    "Crear eventos con fecha, hora, ubicacion y descripcion.",
    "Actualizar o eliminar eventos existentes.",
    "Confirmar asistencia y enviar recordatorios.",
  ];

  const selectedEventSummary = selectedEvent
    ? `${selectedEvent.location} · ${selectedEvent.date} · ${selectedEvent.time}`
    : "Selecciona un evento para ver su informacion";

  const selectedEventDescription = selectedEvent?.description
    ? selectedEvent.description
    : "Aqui veras el resumen de participacion, estado y acciones del evento.";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.hero}>
          <Text style={styles.kicker}>GESTION DE EVENTOS</Text>
          <Text style={styles.title}>Crear, editar y controlar eventos</Text>
          <Text style={styles.subtitle}>
            Centraliza el ciclo completo de tus eventos y deja claras las
            acciones del organizador.
          </Text>
        </View> */}

        {/* <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lo que cubre esta pestaña</Text>
          {manageActions.map((item) => (
            <Text key={item} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View> */}

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
            <TextInput
              placeholder="2026-06-05"
              placeholderTextColor={palette.muted}
              value={date}
              onChangeText={setDate}
              style={[styles.input, styles.rowInput]}
            />
            <TextInput
              placeholder="18:00"
              placeholderTextColor={palette.muted}
              value={time}
              onChangeText={setTime}
              style={[styles.input, styles.rowInput]}
            />
          </View>

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

          {/* <View style={styles.statusWrap}>
            {statusOptions.map((option) => {
              const isActive = status === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setStatus(option)}
                  style={[
                    styles.statusChip,
                    isActive && styles.statusChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      isActive && styles.statusChipTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View> */}

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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos proximos</Text>
          <Text style={styles.sectionHint}>
            Toca uno para ver detalles, editarlo o eliminarlo.
          </Text>
        </View>

        <View style={styles.list}>
          {upcomingEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventStatus}>{event.status}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetail}>
                {event.location} · {event.date} · {event.time}
              </Text>
              <Text style={styles.eventDetail}>{event.description}</Text>

              <View style={styles.cardActions}>
                <Pressable
                  style={styles.cardAction}
                  onPress={() => openEventForDetails(event.id)}
                >
                  <Text style={styles.cardActionText}>Ver</Text>
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
                  <Text
                    style={[styles.cardActionText, styles.cardActionDangerText]}
                  >
                    Eliminar
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos pasados</Text>
          <Text style={styles.sectionHint}>Historial para consulta rapida</Text>
        </View>

        <View style={styles.list}>
          {pastEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventStatus}>{event.status}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetail}>
                {event.location} · {event.date} · {event.time}
              </Text>
              <Text style={styles.eventDetail}>{event.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Detalle del evento</Text>
          <Text style={styles.detailTitle}>
            {selectedEvent?.title ?? "Sin evento seleccionado"}
          </Text>
          <Text style={styles.detailMeta}>{selectedEventSummary}</Text>
          <Text style={styles.detailDescription}>
            {selectedEventDescription}
          </Text>
        </View>

        {/* <View style={styles.participationCard}>
          <Text style={styles.sectionTitle}>Participacion</Text>
          <Text style={styles.sectionHint}>
            Confirmacion de asistencia y recordatorios para los asistentes.
          </Text>
          <Text style={styles.bullet}>
            • Los usuarios pueden confirmar su asistencia.
          </Text>
          <Text style={styles.bullet}>
            • Se pueden enviar notificaciones de cambios o recordatorios.
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  hero: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  kicker: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: palette.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: palette.primarySoft,
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  formCard: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: palette.line,
    gap: Spacing.two,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
  },
  bullet: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionHint: {
    color: palette.muted,
    fontSize: 13,
  },
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
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  rowInput: {
    flex: 1,
  },
  statusWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.primarySoft,
  },
  statusChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  statusChipText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
  },
  statusChipTextActive: {
    color: "#FFFFFF",
  },
  formActions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: palette.primarySoft,
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
  },
  list: {
    gap: Spacing.two,
  },
  eventCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 4,
  },
  eventStatus: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  eventTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
  },
  eventDetail: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
  },
  cardAction: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.primarySoft,
  },
  cardActionText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
  },
  cardActionDanger: {
    backgroundColor: "#F8E5E5",
  },
  cardActionDangerText: {
    color: "#9A2F2F",
  },
  detailCard: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.four,
    gap: 6,
  },
  detailTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  detailMeta: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  detailDescription: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  participationCard: {
    backgroundColor: palette.primarySoft,
    borderRadius: 24,
    padding: Spacing.four,
    gap: 4,
  },
});
