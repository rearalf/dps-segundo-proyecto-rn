import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, Spacing } from "@/constants/theme";

export default function HistoryTabScreen() {
  const stats = [
    { value: "24", label: "Eventos historicos" },
    { value: "89%", label: "Asistencia promedio" },
    { value: "412", label: "Comentarios recibidos" },
  ];

  const pastEvents = [
    {
      title: "Festival de Verano",
      detail: "Cerro el mes con 210 asistentes y 48 comentarios positivos.",
    },
    {
      title: "Campaña de Limpieza",
      detail: "Participaron 56 vecinos y se completaron 6 puntos de apoyo.",
    },
    {
      title: "Taller de Primeros Auxilios",
      detail: "Evento con 100% de asistencia confirmada y alta valoracion.",
    },
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
            Consulta participacion, asistencia y comentarios para medir el
            impacto de cada actividad.
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos pasados</Text>
          <Text style={styles.sectionHint}>
            Registro reciente de actividades
          </Text>
        </View>

        <View style={styles.list}>
          {pastEvents.map((event) => (
            <View key={event.title} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetail}>{event.detail}</Text>
            </View>
          ))}
        </View>
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
    fontSize: 29,
    lineHeight: 33,
    fontWeight: "800",
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.primarySoft,
    borderRadius: 18,
    padding: Spacing.three,
    gap: 4,
  },
  statValue: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
  },
  sectionHint: {
    color: palette.muted,
    fontSize: 13,
  },
  list: {
    gap: Spacing.two,
  },
  eventCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.four,
    gap: 4,
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
});
