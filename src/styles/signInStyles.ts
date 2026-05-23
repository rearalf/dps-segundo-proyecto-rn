import { BottomTabInset, palette, Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

const signInStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  safeAreaOuter: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  safeArea: {
    width: "100%",
    paddingHorizontal: Spacing.four,
    alignSelf: "center",
    justifyContent: "center",
    paddingBottom: BottomTabInset + Spacing.four,
    paddingTop: Spacing.five,
    maxWidth: 520,
    gap: Spacing.four,
  },
  brand: {
    textAlign: "center",
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  heroHeader: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "800",
    color: palette.text,
  },
  subtitle: {
    fontSize: 15,
    color: palette.muted,
    lineHeight: 21,
  },
  switchRow: {
    alignSelf: "stretch",
  },
  switchPill: {
    flexDirection: "row",
    backgroundColor: palette.primarySoft,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  switchOption: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  switchOptionActive: {
    backgroundColor: palette.primary,
  },
  switchText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
  switchTextActive: {
    color: "#FFFFFF",
  },
  card: {
    alignSelf: "stretch",
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: palette.line,
    gap: Spacing.two,
  },
  forgot: {
    color: palette.muted,
    textAlign: "right",
    fontSize: 13,
  },
  button: {
    alignSelf: "stretch",
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: Spacing.one,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  links: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.one,
  },
  linkText: {
    color: palette.muted,
    fontSize: 14,
  },
  linkAction: {
    color: palette.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 14,
  },
});

export default signInStyles;
