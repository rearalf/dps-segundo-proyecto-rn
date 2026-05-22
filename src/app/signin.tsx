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
import useSignIn from "@/hooks/useSignIn";
import signInStyles from "@/styles/signInStyles";

function SignInScreen() {
  const { email, loading, password, setEmail, setPassword, handleSignIn } =
    useSignIn();

  return (
    <KeyboardAvoidingView
      style={signInStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={signInStyles.safeAreaOuter}>
        <ScrollView
          contentContainerStyle={signInStyles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={signInStyles.safeArea}>
            <Text style={signInStyles.brand}>ComuniVentos</Text>

            <View style={signInStyles.heroHeader}>
              <Text style={signInStyles.title}>Bienvenido de nuevo!</Text>
              <Text style={signInStyles.subtitle}>
                Tu conexion con los eventos de tu comunidad.
              </Text>
            </View>

            <View style={signInStyles.switchRow}>
              <View style={signInStyles.switchPill}>
                <Pressable
                  style={[
                    signInStyles.switchOption,
                    signInStyles.switchOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      signInStyles.switchText,
                      signInStyles.switchTextActive,
                    ]}
                  >
                    Login
                  </Text>
                </Pressable>
                <Link href="/signup" asChild>
                  <Pressable style={signInStyles.switchOption}>
                    <Text style={signInStyles.switchText}>Sign up</Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            <View style={signInStyles.card}>
              <CustomInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="equipo@comunidad.org"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Minimo 8 caracteres"
                secureTextEntry
                autoCapitalize="none"
              />

              {/* <Pressable>
                <Text style={signInStyles.forgot}>Olvide mi password</Text>
              </Pressable> */}

              <TouchableOpacity
                style={signInStyles.button}
                onPress={handleSignIn}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={signInStyles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={signInStyles.links}>
              <Text style={signInStyles.linkText}>No tienes cuenta?</Text>
              <Link href="/signup" style={signInStyles.linkAction}>
                Crea una cuenta
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default SignInScreen;
