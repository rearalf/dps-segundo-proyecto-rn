import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, Spacing } from "@/constants/theme";

export default function CommunityTabScreen() {
  const sections = [
    {
      title: "Comentarios y calificaciones",
      text: "Los usuarios pueden dejar comentarios, puntuar eventos y compartir feedback para futuros encuentros.",
    },
    {
      title: "Compartir eventos",
      text: "Difusion rapida por redes sociales y correo electronico para aumentar alcance.",
    },
  ];

  const feedback = [
    {
      user: "Mariana",
      comment: "La jornada tuvo buena organizacion y mucha participacion.",
      rating: "5/5",
    },
    {
      user: "Luis",
      comment: "Seria ideal agregar mas recordatorios antes del inicio.",
      rating: "4/5",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>INTERACCION SOCIAL</Text>
          <Text style={styles.title}>
            Comentarios, calificaciones y difusion
          </Text>
          <Text style={styles.subtitle}>
            Convierte cada evento en un espacio de retroalimentacion y alcance
            comunitario.
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.text}>{section.text}</Text>
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Opiniones recientes</Text>
          <Text style={styles.sectionHint}>
            Ejemplo de comentarios y valoraciones
          </Text>
        </View>

        <View style={styles.list}>
          {feedback.map((item) => (
            <View key={item.user} style={styles.feedbackCard}>
              <Text style={styles.feedbackRating}>{item.rating}</Text>
              <Text style={styles.feedbackUser}>{item.user}</Text>
              <Text style={styles.feedbackComment}>{item.comment}</Text>
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
    fontSize: 28,
    lineHeight: 32,
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
    gap: 6,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
  },
  text: {
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
  list: {
    gap: Spacing.two,
  },
  feedbackCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.four,
    gap: 4,
  },
  feedbackRating: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  feedbackUser: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
  },
  feedbackComment: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
