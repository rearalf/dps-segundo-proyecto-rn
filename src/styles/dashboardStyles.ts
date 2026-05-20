import { BottomTabInset, palette, Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  safeAreaOuter: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.five,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    alignSelf: "center",
    width: "100%",
    paddingTop: Spacing.four,
    maxWidth: 620,
  },
  brand: {
    textAlign: "center",
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  heroCardSoft: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: palette.line,
  },
  kicker: {
    color: palette.primary,
    fontSize: 12,
    letterSpacing: 1.1,
    fontWeight: "700",
  },
  title: {
    color: palette.text,
    fontSize: 34,
    lineHeight: 38,
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
    marginTop: Spacing.one,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.primarySoft,
    borderRadius: 16,
    padding: Spacing.two,
    gap: 2,
  },
  statValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    marginTop: Spacing.two,
    gap: 2,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 21,
    fontWeight: "800",
  },
  sectionHint: {
    color: palette.muted,
    fontSize: 13,
  },
  eventsList: {
    gap: Spacing.two,
  },
  eventCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    padding: Spacing.three,
    gap: 4,
  },
  eventDate: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  eventTitle: {
    color: palette.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
  },
  eventMeta: {
    color: palette.muted,
    fontSize: 13,
  },
  actionsRow: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  primaryAction: {
    backgroundColor: palette.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryAction: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: palette.primarySoft,
  },
  secondaryActionText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
});

export default dashboardStyles;
