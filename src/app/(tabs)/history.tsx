import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, Spacing } from "@/constants/theme";
import useHistory from "@/hooks/useHistory";

export default function HistoryTabScreen() {
  const {
    attendedEvents,
    commentsByEventId,
    isUserAttendingEvent,
    loading,
    pastEvents,
    stats,
  } = useHistory();

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
                Aun no tienes eventos en tu historial. Confirma asistencia a
                eventos proximos!
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
                <Text style={styles.attendeeCount}>
                  {event.attendees?.length ?? 0} asistentes confirmados ·{" "}
                  {commentsByEventId[event.id] ?? 0} comentarios
                </Text>
                <Text style={styles.attendedBadge}>✓ Asististe</Text>
              </View>
            ))}
          </View>
        )}

        {/* Todos los eventos pasados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Todos los eventos pasados</Text>
          <Text style={styles.sectionHint}>
            Registro general de actividades
          </Text>
        </View>

        <View style={styles.list}>
          {pastEvents.length === 0 && (
            <Text style={styles.emptyText}>No hay eventos pasados aun.</Text>
          )}
          {pastEvents.map((event) => {
            const attended = isUserAttendingEvent(event);
            return (
              <View
                key={event.id}
                style={[styles.eventCard, !attended && styles.eventCardMuted]}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDetail}>
                  {event.location} · {event.date} · {event.time}
                </Text>
                <Text style={styles.attendeeCount}>
                  {event.attendees?.length ?? 0} asistentes ·{" "}
                  {commentsByEventId[event.id] ?? 0} comentarios
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
  kicker: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: palette.text,
    fontSize: 29,
    lineHeight: 33,
    fontWeight: "800",
  },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 20 },
  statsRow: { flexDirection: "row", gap: Spacing.two, flexWrap: "wrap" },
  statCard: {
    width: "48%",
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
  emptyText: {
    color: palette.muted,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 12,
  },
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
