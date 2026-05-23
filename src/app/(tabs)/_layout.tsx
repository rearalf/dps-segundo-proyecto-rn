import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, StyleSheet } from "react-native";

import { palette } from "@/constants/theme";

function TabIcon({
  focused,
  source,
  iconName,
}: {
  focused: boolean;
  source?: number;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
}) {
  const tintColor = focused ? palette.primary : palette.muted;

  if (source) {
    return <Image source={source} style={[styles.imageIcon, { tintColor }]} />;
  }

  return (
    <MaterialCommunityIcons
      name={iconName ?? "circle"}
      size={22}
      color={tintColor}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={require("@/assets/images/tabIcons/home.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Eventos",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={require("@/assets/images/tabIcons/explore.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Comunidad",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="account-group" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="chart-line" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: palette.surface,
    borderTopColor: palette.line,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
  item: {
    paddingTop: 4,
  },
  imageIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});
