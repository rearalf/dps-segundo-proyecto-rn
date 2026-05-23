import { Link, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";
import dashboardStyles from "@/styles/dashboardStyles";

export default function HomeTabScreen() {
  const router = useRouter();
  const clearSession = useAuthSessionStore((state) => state.clearSession);

  const upcomingEvents = [
    {
      id: "1",
      title: "Feria de Emprendedores Barriales",
      date: "Sab 24 May · 10:00",
      place: "Plaza Central",
      attendees: 82,
    },
  ];

  async function handleSignOut() {
    await signOut(auth);
    clearSession();
    router.replace("/signin");
  }

  return (
    <View style={dashboardStyles.container}>
      <SafeAreaView style={dashboardStyles.safeAreaOuter}>
        <ScrollView
          style={dashboardStyles.scroll}
          contentContainerStyle={dashboardStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={dashboardStyles.safeArea}>
            <Text style={dashboardStyles.brand}>ComuniVentos</Text>

            <View style={dashboardStyles.heroCardSoft}>
              <Text style={dashboardStyles.kicker}>INICIO</Text>
              <Text style={dashboardStyles.title}>Organiza tu comunidad</Text>
              <Text style={dashboardStyles.subtitle}>
                Visualiza eventos activos, asistencia y tareas pendientes en un
                solo lugar.
              </Text>

              <View style={dashboardStyles.statsRow}>
                <View style={dashboardStyles.statCard}>
                  <Text style={dashboardStyles.statValue}>12</Text>
                  <Text style={dashboardStyles.statLabel}>Eventos activos</Text>
                </View>
                <View style={dashboardStyles.statCard}>
                  <Text style={dashboardStyles.statValue}>137</Text>
                  <Text style={dashboardStyles.statLabel}>
                    Asistentes este mes
                  </Text>
                </View>
                <View style={dashboardStyles.statCard}>
                  <Text style={dashboardStyles.statValue}>9</Text>
                  <Text style={dashboardStyles.statLabel}>Voluntarios</Text>
                </View>
              </View>
            </View>

            <View style={dashboardStyles.sectionHeader}>
              <Text style={dashboardStyles.sectionTitle}>Proximos eventos</Text>
              <Text style={dashboardStyles.sectionHint}>
                Planificacion de la semana
              </Text>
            </View>

            <View style={dashboardStyles.eventsList}>
              {upcomingEvents.map((event) => (
                <View key={event.id} style={dashboardStyles.eventCard}>
                  <Text style={dashboardStyles.eventDate}>{event.date}</Text>
                  <Text style={dashboardStyles.eventTitle}>{event.title}</Text>
                  <Text style={dashboardStyles.eventMeta}>{event.place}</Text>
                  <Text style={dashboardStyles.eventMeta}>
                    {event.attendees} personas confirmadas
                  </Text>
                </View>
              ))}
            </View>

            <View style={dashboardStyles.actionsRow}>
              <Link href="/events" asChild>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={dashboardStyles.primaryAction}
                >
                  <Text style={dashboardStyles.primaryActionText}>
                    Ver gestion de eventos
                  </Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity
                activeOpacity={0.9}
                style={dashboardStyles.secondaryAction}
                onPress={handleSignOut}
              >
                <Text style={dashboardStyles.secondaryActionText}>
                  Cerrar sesion
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
