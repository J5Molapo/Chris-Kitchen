import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getCustomerPreferences,
  setCustomerPreferences,
  setSelectedCourseIds,
  submitCustomerMealOrder,
  useAppStore,
} from "./store";

const preferenceOptions = ["Vegetarian", "High Protein", "No Spice", "Quick Pick", "Seasonal"];

export default function MenuScreen() {
  const router = useRouter();
  const { preferences, publishedMenu, selectedCourseIds } = useAppStore();

  const togglePreference = (value: (typeof preferences)[number]) => {
    const nextPreferences = preferences.includes(value)
      ? preferences.filter((item) => item !== value)
      : [...preferences, value];

    setCustomerPreferences(nextPreferences);
  };

  const viewCourses = useMemo(() => {
    if (preferences.length) {
      const selected = new Set(preferences);
      return publishedMenu.filter((course) => course.tags.some((tag) => selected.has(tag)));
    }
    return publishedMenu;
  }, [preferences, publishedMenu]);

  const toggleCourse = (courseId: string) => {
    const exists = selectedCourseIds.includes(courseId);
    const nextSelection = exists
      ? selectedCourseIds.filter((id) => id !== courseId)
      : [...selectedCourseIds, courseId];

    setSelectedCourseIds(nextSelection);
  };

  const handleSendToChef = () => {
    if (!selectedCourseIds.length) {
      return;
    }

    submitCustomerMealOrder(selectedCourseIds);
    router.push("/preferences");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="labelLarge" style={styles.kicker}>Tonight's menu</Text>
            <Text style={styles.title}>Chef's tasting</Text>
          </View>
          <Button mode="contained" onPress={() => router.push("/")} buttonColor="#d9b778" textColor="#1d1713">
            Home
          </Button>
        </View>

        <Surface style={styles.searchBar}>
          <Text style={styles.searchText}>Active preferences: {getCustomerPreferences().join(" • ") || "None selected"}</Text>
          <Text style={styles.infoText}>{selectedCourseIds.length} dish{selectedCourseIds.length === 1 ? "" : "es"} selected</Text>
        </Surface>

        <View style={styles.filterRow}>
          {preferenceOptions.map((item) => {
            const active = preferences.includes(item as typeof preferences[number]);
            return (
              <Chip
                key={item}
                selected={active}
                onPress={() => togglePreference(item as typeof preferences[number])}
                style={styles.filterChip}
                textStyle={styles.filterChipText}
                selectedColor="#201915"
                theme={{ colors: { primary: "#d9b778" } }}
              >
                {item}
              </Chip>
            );
          })}
        </View>

        {viewCourses.length ? (
          viewCourses.map((course) => {
            const selected = selectedCourseIds.includes(course.id);
            return (
              <Card
                key={course.id}
                mode="contained"
                onPress={() => toggleCourse(course.id)}
                style={[styles.courseCard, selected && styles.courseCardSelected]}
              >
                <Card.Content>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseStep}>Course {course.step}</Text>
                    <Text style={styles.coursePrice}>${course.price}</Text>
                  </View>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseDescription}>{course.description}</Text>
                  <View style={styles.tagRow}>
                    {course.tags.map((tag) => (
                      <Chip key={`${course.id}-${tag}`} compact style={styles.tag} textStyle={styles.tagText}>
                        {tag}
                      </Chip>
                    ))}
                  </View>

                  <Button
                    mode={selected ? "contained" : "outlined"}
                    onPress={() => toggleCourse(course.id)}
                    style={styles.selectButton}
                    buttonColor={selected ? "#d9b778" : undefined}
                    textColor={selected ? "#1d1713" : "#f8f1ea"}
                    compact
                  >
                    {selected ? "Selected" : "Select"}
                  </Button>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No dishes match the current preferences. Try another selection.</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSendToChef}
          disabled={!selectedCourseIds.length}
          buttonColor="#d9b778"
          textColor="#1d1713"
          style={[styles.primaryButton, !selectedCourseIds.length && styles.primaryButtonDisabled]}
        >
          Send selected dishes to chef
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#120d0b" },
  container: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 32 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  kicker: { color: "#d9b778", fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: "700" },
  title: { marginTop: 4, color: "#f8f1ea", fontSize: 30, fontWeight: "800" },
  searchBar: { backgroundColor: "#201915", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: "#382d28", marginBottom: 18 },
  searchText: { color: "#d6c8bb", fontSize: 14, fontWeight: "600" },
  infoText: { color: "#f2cf8a", marginTop: 6, fontSize: 12, fontWeight: "700" },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  filterChip: { marginRight: 8, marginBottom: 8, backgroundColor: "#1f1714", borderColor: "#382d28" },
  filterChipText: { color: "#efe7df", fontWeight: "700", fontSize: 12 },
  courseCard: { backgroundColor: "#1a1412", borderRadius: 22, marginBottom: 14, borderWidth: 1, borderColor: "#3a302b" },
  courseCardSelected: { backgroundColor: "#221a17", borderColor: "#d9b778" },
  courseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  courseStep: { color: "#d9b778", fontSize: 12, letterSpacing: 1.3, textTransform: "uppercase", fontWeight: "700" },
  coursePrice: { color: "#f8f1ea", fontSize: 18, fontWeight: "800" },
  courseName: { color: "#fffaf4", fontSize: 22, fontWeight: "800", marginBottom: 6 },
  courseDescription: { color: "#d6c8bb", fontSize: 13, lineHeight: 18 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  tag: { backgroundColor: "#e3c27f", marginRight: 6, marginBottom: 6 },
  tagText: { color: "#201915", fontWeight: "700", fontSize: 11 },
  selectButton: { marginTop: 14, alignSelf: "flex-start" },
  primaryButton: { marginTop: 12, borderRadius: 16 },
  primaryButtonDisabled: { opacity: 0.45 },
  emptyText: { color: "#d9c9b8", fontSize: 13 },
});
