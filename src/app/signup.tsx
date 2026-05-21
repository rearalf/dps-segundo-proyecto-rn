import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import signUpStyles from "@/styles/signUpStyles";

import { auth, db } from "@/services/firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<number | null>(null);

  async function handleSignUp() {
    try {
      if (!name || !email || !password || !role) {
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

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
                  <Pressable style={signUpStyles.switchOption}>
                    <Text style={signUpStyles.switchText}>Login</Text>
                  </Pressable>
                </Link>

                <Pressable
                  style={[
                    signUpStyles.switchOption,
                    signUpStyles.switchOptionActive,
                  ]}
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
              />

              <CustomInput
                label="Correo electrónico"
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

              <View style={signUpStyles.selectGroup}>
                <Text style={signUpStyles.selectLabel}>
                  Quiero registrarme como...
                </Text>

                <View style={signUpStyles.roleSwitch}>
                  <TouchableOpacity
                    style={[
                      signUpStyles.roleOption,
                      role === 1 && signUpStyles.roleOptionActive,
                    ]}
                    onPress={() => setRole(1)}
                  >
                    <Text
                      style={[
                        signUpStyles.roleText,
                        role === 1 && signUpStyles.roleTextActive,
                      ]}
                    >
                      Organizador
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      signUpStyles.roleOption,
                      role === 2 && signUpStyles.roleOptionActive,
                    ]}
                    onPress={() => setRole(2)}
                  >
                    <Text
                      style={[
                        signUpStyles.roleText,
                        role === 2 && signUpStyles.roleTextActive,
                      ]}
                    >
                      Participante
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={signUpStyles.button}
                onPress={handleSignUp}
                activeOpacity={0.9}
              >
                <Text style={signUpStyles.buttonText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>

            <View style={signUpStyles.links}>
              <Text style={signUpStyles.linkText}>Ya tienes cuenta?</Text>
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
