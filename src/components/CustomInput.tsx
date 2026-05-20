import { palette } from "@/constants/theme";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface CustomInputProps extends TextInputProps {
  label: string;
}

export function CustomInput({
  label,
  onFocus,
  onBlur,
  style,
  ...rest
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        selectionColor={palette.primary}
        placeholderTextColor="#8D968B"
        onFocus={(e) => {
          setIsFocused(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        style={[styles.input, isFocused && styles.inputFocused, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 6,
    alignSelf: "stretch",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.text,
  },
  input: {
    alignSelf: "stretch",
    padding: Platform.select({ web: 14, default: 12 }),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.inputBg,
    fontSize: 16,
    color: palette.text,
  },
  inputFocused: {
    borderColor: palette.primary,
    backgroundColor: "#FFFFFF",
  },
});
