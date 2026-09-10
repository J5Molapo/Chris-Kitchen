import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  clearConfirmation,
  getFilteredCourses,
  setCustomerPreferences,
  submitCustomerMealOrder,
  useAppStore,
  type Preference,
} from "./store";

const baseOptions: Preference[] = [
  "Vegetarian",
  "High Protein",
  "No Spice",
  "Quick Pick",
  "Seasonal",
];

export default function PreferencesScreen() {
  const router = useRouter();
  const { preferences, confirmation } = useAppStore();
  const [selected, setSelected] = useState<Preference[]>(preferences.length ? preferences : ["Seasonal", "High Protein"]);

  const togglePreference = (value: Preference) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const handleSave = () => {
    const nextPreferences: Preference[] = selected.length ? selected : ["Seasonal"];
    setCustomerPreferences(nextPreferences);
    submitCustomerMealOrder(getFilteredCourses().map((course) => course.id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="labelLarge" style={styles.kicker}>Preferences</Text>
            <Text style={styles.title}>Dinner style</Text>
          </View>
          <Button mode="contained" onPress={() => router.push("/")} buttonColor="#d8b777" textColor="#1d1713">
            Home
          </Button>
        </View>

        <Surface style={styles.panel}>
          <Text style={styles.panelTitle}>Your taste profile</Text>
          <View style={styles.chipRow}>
            {baseOptions.map((chip) => {
              const active = selected.includes(chip);
              return (
                <Chip
                  key={chip}
                  selected={active}
                  onPress={() => togglePreference(chip)}
                  style={[styles.chip, active && styles.chipActive]}
                  textStyle={[styles.chipText, active && styles.chipTextActive]}
                >
                  {chip}
                </Chip>
              );
            })}
          </View>
        </Surface>

        <Surface style={styles.panel}>
          <Text style={styles.panelTitle}>Dining preferences</Text>
          <View style={styles.listRow}>
            <Text style={styles.listText}>Light and elegant pacing</Text>
            <Text style={styles.listValue}>On</Text>
          </View>
          <View style={styles.listRow}>
            <Text style={styles.listText}>Chef-led customization</Text>
            <Text style={styles.listValue}>On</Text>
          </View>
          <View style={styles.listRow}>
            <Text style={styles.listText}>Allergen-conscious prep</Text>
            <Text style={styles.listValue}>Priority</Text>
          </View>
        </Surface>

        <Card mode="contained" style={styles.ctaBox}>
          <Card.Content>
            <Text style={styles.ctaTitle}>Ready for your menu?</Text>
            <Text style={styles.ctaText}>We’ll tailor the next meal to your taste profile and send it to the kitchen instantly.</Text>
            <Button mode="contained" onPress={handleSave} buttonColor="#d8b777" textColor="#1d1713" style={styles.primaryButton}>
              Save preferences
            </Button>
          </Card.Content>
        </Card>

        {confirmation ? (
          <Card mode="contained" style={styles.confirmationBox}>
            <Card.Content>
              <Text style={styles.confirmationTitle}>Order confirmed</Text>
              <Text style={styles.confirmationText}>{confirmation.preferences.join(", ")} tasting • {confirmation.courseCount} courses</Text>
              <Text style={styles.confirmationTextAccent}>{confirmation.servedAtLabel}</Text>
              <Button
                mode="contained"
                onPress={() => {
                  clearConfirmation();
                  router.push("/menu");
                }}
                buttonColor="#201915"
                textColor="#f8f1ea"
              >
                Back to menu
              </Button>
            </Card.Content>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#120d0b" },
  container: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 32 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  kicker: { color: "#d8b777", fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: "700" },
  title: { marginTop: 4, color: "#f8f1ea", fontSize: 30, fontWeight: "800" },
  panel: { backgroundColor: "#1b1512", borderRadius: 22, borderWidth: 1, borderColor: "#332821", padding: 16, marginBottom: 18 },
  panelTitle: { color: "#f8f1ea", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { backgroundColor: "#1f1714", borderWidth: 1, borderColor: "#382d28", marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: "#e3c27f", borderColor: "#e3c27f" },
  chipText: { color: "#efe7df", fontWeight: "800", fontSize: 12 },
  chipTextActive: { color: "#1f1713" },
  listRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#302721" },
  listText: { color: "#efe7df", fontSize: 14, fontWeight: "600" },
  listValue: { color: "#d8b777", fontSize: 12, fontWeight: "800" },
  ctaBox: { backgroundColor: "#1e1714", borderRadius: 26, marginBottom: 18 },
  ctaTitle: { color: "#fffaf4", fontSize: 24, fontWeight: "800", marginBottom: 6 },
  ctaText: { color: "#d7c7b7", fontSize: 13, lineHeight: 20, marginBottom: 16 },
  primaryButton: { alignSelf: "flex-start" },
  confirmationBox: { backgroundColor: "#1d1713", borderRadius: 24, borderWidth: 1, borderColor: "#d8b777", marginTop: 18 },
  confirmationTitle: { color: "#f5d38a", fontSize: 20, fontWeight: "800", marginBottom: 8 },
  confirmationText: { color: "#f8f1ea", fontSize: 14, lineHeight: 20 },
  confirmationTextAccent: { color: "#d8b777", marginTop: 8, marginBottom: 12, fontWeight: "800" },
});
