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
import { db } from "@/services/firebase";

const commentsCollection = collection(db, "comments");

type Comment = {
  id: string;
  user: string;
  comment: string;
  rating: number;
  createdAt: number;
  eventTitle?: string;
};

export default function CommunityTabScreen() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(commentsCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((d) => ({
        id: d.id,
        user: String(d.data().user ?? "Anonimo"),
        comment: String(d.data().comment ?? ""),
        rating: Number(d.data().rating ?? 0),
        createdAt: Number(d.data().createdAt ?? 0),
        eventTitle: String(d.data().eventTitle ?? ""),
      }));
      setComments(loaded);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderStars = (count: number) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={[styles.star, star <= count && styles.starActive]}>
          ★
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>INTERACCION SOCIAL</Text>
          <Text style={styles.title}>Comentarios y calificaciones</Text>
          <Text style={styles.subtitle}>
            Opiniones de la comunidad sobre los eventos. Para comentar, confirma
            asistencia a un evento y dejanos tu opinion desde la pestaña Eventos.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Opiniones de la comunidad</Text>
          <Text style={styles.sectionHint}>
            {comments.length}{" "}
            {comments.length === 1 ? "comentario" : "comentarios"}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={palette.primary} />
        ) : (
          <View style={styles.list}>
            {comments.length === 0 && (
              <Text style={styles.emptyText}>
                Aun no hay comentarios. Confirma asistencia a un evento y se el primero!
              </Text>
            )}
            {comments.map((item) => (
              <View key={item.id} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <Text style={styles.feedbackUser}>{item.user}</Text>
                  <Text style={styles.feedbackDate}>{formatDate(item.createdAt)}</Text>
                </View>
                {item.eventTitle ? (
                  <Text style={styles.feedbackEvent}>📅 {item.eventTitle}</Text>
                ) : null}
                {renderStars(item.rating)}
                <Text style={styles.feedbackComment}>{item.comment}</Text>
              </View>
            ))}
          </View>
        )}
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
  title: { color: palette.text, fontSize: 28, lineHeight: 32, fontWeight: "800" },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: palette.text, fontSize: 18, fontWeight: "800" },
  sectionHeader: { gap: 2 },
  sectionHint: { color: palette.muted, fontSize: 13 },
  starsRow: { flexDirection: "row", gap: 4 },
  star: { fontSize: 24, color: palette.line },
  starActive: { color: "#F5A623" },
  list: { gap: Spacing.two },
  emptyText: { color: palette.muted, fontSize: 14, textAlign: "center", paddingVertical: 12 },
  feedbackCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.four,
    gap: 6,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedbackUser: { color: palette.text, fontSize: 16, fontWeight: "700" },
  feedbackDate: { color: palette.muted, fontSize: 12 },
  feedbackEvent: { color: palette.primary, fontSize: 12, fontWeight: "700" },
  feedbackComment: { color: palette.muted, fontSize: 13, lineHeight: 18 },
});