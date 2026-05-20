import { Link, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import dashboardStyles from "@/styles/dashboardStyles";

function DashboardScreen() {
  const router = useRouter();

  function handleSignOut() {
    router.replace("/signin");
  }

  const upcomingEvents = [
    {
      id: "1",
      title: "Feria de Emprendedores Barriales",
      date: "Sab 24 May · 10:00",
      place: "Plaza Central",
      attendees: 82,
    },
    {
      id: "2",
      title: "Taller de Reciclaje Comunitario",
      date: "Mie 28 May · 16:30",
      place: "Centro Cultural Norte",
      attendees: 34,
    },
    {
      id: "3",
      title: "Asamblea de Coordinadores",
      date: "Vie 30 May · 19:00",
      place: "Salon Vecinal",
      attendees: 21,
    },
  ];

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
              <Text style={dashboardStyles.kicker}>DASHBOARD</Text>
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
              <Link href="/signup" asChild>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={dashboardStyles.primaryAction}
                >
                  <Text style={dashboardStyles.primaryActionText}>
                    Invitar organizador
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

export default DashboardScreen;
