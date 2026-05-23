import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomInput } from "@/components/";
import { useSignUp } from "@/hooks/useSignUp";
import signUpStyles from "@/styles/signUpStyles";

function SignUpScreen() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSignUp,
  } = useSignUp();

  return (
    <KeyboardAvoidingView
      style={signUpStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={signUpStyles.safeAreaOuter}>
        <ScrollView
          contentContainerStyle={signUpStyles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={signUpStyles.safeArea}>
            <Text style={signUpStyles.brand}>ComuniVentos</Text>

            <View style={signUpStyles.heroHeader}>
              <Text style={signUpStyles.title}>Unete a tu comunidad</Text>
              <Text style={signUpStyles.subtitle}>
                Crea eventos, invita vecinos y organiza actividades locales.
              </Text>
            </View>

            <View style={signUpStyles.switchRow}>
              <View style={signUpStyles.switchPill}>
                <Link href="/signin" asChild>
                  <Pressable
                    style={signUpStyles.switchOption}
                    disabled={loading}
                  >
                    <Text style={signUpStyles.switchText}>Login</Text>
                  </Pressable>
                </Link>

                <Pressable
                  style={[
                    signUpStyles.switchOption,
                    signUpStyles.switchOptionActive,
                  ]}
                  disabled={loading}
                >
                  <Text
                    style={[
                      signUpStyles.switchText,
                      signUpStyles.switchTextActive,
                    ]}
                  >
                    Sign up
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={signUpStyles.card}>
              <CustomInput
                label="Nombre"
                value={name}
                onChangeText={setName}
                placeholder="Ej. Maria Perez"
                editable={!loading}
              />

              <CustomInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                placeholder="equipo@comunidad.org"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <CustomInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Minimo 8 caracteres"
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />

              <TouchableOpacity
                style={[signUpStyles.button, loading && { opacity: 0.7 }]}
                onPress={handleSignUp}
                activeOpacity={0.9}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={signUpStyles.buttonText}>Crear cuenta</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={signUpStyles.links}>
              <Text style={signUpStyles.linkText}>¿Ya tienes cuenta?</Text>
              <Link href="/signin" style={signUpStyles.linkAction}>
                Iniciar sesion
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen;
