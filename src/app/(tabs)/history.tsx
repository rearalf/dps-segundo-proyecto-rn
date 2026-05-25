import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, Spacing } from "@/constants/theme";
import { IEventItem } from "@/interfaces/IEvents";
import { db } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";

const eventsCollection = collection(db, "events");
const commentsCollection = collection(db, "comments");

export default function HistoryTabScreen() {
  const user = useAuthSessionStore((state) => state.user);

  const [events, setEvents] = useState<IEventItem[]>([]);
  const [myCommentsCount, setMyCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qEvents = query(eventsCollection, orderBy("createdAt", "desc"));
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
      const loaded = snapshot.docs.map((d) => ({
        id: d.id,
        title: String(d.data().title ?? ""),
        date: String(d.data().date ?? ""),
        time: String(d.data().time ?? ""),
        location: String(d.data().location ?? ""),
        description: String(d.data().description ?? ""),
        status: String(d.data().status ?? ""),
        isPast: Boolean(d.data().isPast ?? false),
        attendees: Array.isArray(d.data().attendees) ? d.data().attendees : [],
      }));
      setEvents(loaded);
      setLoading(false);
    });

    const qComments = query(commentsCollection);
    const unsubscribeComments = onSnapshot(qComments, (snapshot) => {
      const myComments = snapshot.docs.filter(
        (d) => d.data().userId === user?.uid,
      );
      setMyCommentsCount(myComments.length);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeComments();
    };
  }, []);

  const pastEvents = events.filter((e) => e.isPast);
  const attendedEvents = pastEvents.filter((e) =>
    e.attendees?.includes(user?.uid ?? ""),
  );
  const totalEvents = events.length;

  const stats = [
    { value: String(totalEvents), label: "Eventos totales" },
    { value: String(attendedEvents.length), label: "Eventos asistidos" },
    { value: String(myCommentsCount), label: "Mis comentarios" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>HISTORIAL Y ESTADISTICAS</Text>
          <Text style={styles.title}>Registro y analiticas del evento</Text>
          <Text style={styles.subtitle}>
            Consulta tu participacion, asistencia y comentarios para medir el
            impacto de cada actividad.
          </Text>
        </View>

        {/* Estadísticas reales */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Eventos a los que asistí */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos a los que asististe</Text>
          <Text style={styles.sectionHint}>
            Solo aparecen los eventos donde confirmaste asistencia
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={palette.primary} />
        ) : (
          <View style={styles.list}>
            {attendedEvents.length === 0 && (
              <Text style={styles.emptyText}>
                Aun no tienes eventos en tu historial. Confirma asistencia a eventos proximos!
              </Text>
            )}
            {attendedEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDetail}>
                  {event.location} · {event.date} · {event.time}
                </Text>
                {event.description ? (
                  <Text style={styles.eventDetail}>{event.description}</Text>
                ) : null}
                <Text style={styles.attendedBadge}>✓ Asististe</Text>
              </View>
            ))}
          </View>
        )}

        {/* Todos los eventos pasados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Todos los eventos pasados</Text>
          <Text style={styles.sectionHint}>Registro general de actividades</Text>
        </View>

        <View style={styles.list}>
          {pastEvents.length === 0 && (
            <Text style={styles.emptyText}>No hay eventos pasados aun.</Text>
          )}
          {pastEvents.map((event) => {
            const attended = event.attendees?.includes(user?.uid ?? "");
            return (
              <View key={event.id} style={[styles.eventCard, !attended && styles.eventCardMuted]}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDetail}>
                  {event.location} · {event.date} · {event.time}
                </Text>
                <Text style={styles.attendeeCount}>
                  {event.attendees?.length ?? 0} asistentes
                </Text>
                {attended && (
                  <Text style={styles.attendedBadge}>✓ Asististe</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg },
  content: { padding: Spacing.four, gap: Spacing.three },
  hero: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  kicker: { color: palette.primary, fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  title: { color: palette.text, fontSize: 29, lineHeight: 33, fontWeight: "800" },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 20 },
  statsRow: { flexDirection: "row", gap: Spacing.two },
  statCard: {
    flex: 1,
    backgroundColor: palette.primarySoft,
    borderRadius: 18,
    padding: Spacing.three,
    gap: 4,
  },
  statValue: { color: palette.text, fontSize: 22, fontWeight: "800" },
  statLabel: { color: palette.muted, fontSize: 12, lineHeight: 16 },
  sectionHeader: { gap: 2 },
  sectionTitle: { color: palette.text, fontSize: 18, fontWeight: "800" },
  sectionHint: { color: palette.muted, fontSize: 13 },
  list: { gap: Spacing.two },
  emptyText: { color: palette.muted, fontSize: 14, textAlign: "center", paddingVertical: 12 },
  eventCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.four,
    gap: 4,
  },
  eventCardMuted: { opacity: 0.6 },
  eventTitle: { color: palette.text, fontSize: 17, fontWeight: "700" },
  eventDetail: { color: palette.muted, fontSize: 13, lineHeight: 18 },
  attendeeCount: { color: palette.muted, fontSize: 12, marginTop: 2 },
  attendedBadge: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
});