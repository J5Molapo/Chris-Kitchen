import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  addMenuItem,
  cycleChefOrderStatus,
  removeMenuItem,
  serveChefOrder,
  setPublishedMenu,
  updateMenuItem,
  useAppStore,
  type Preference,
} from "./store";

const blankDraft = {
  name: "",
  description: "",
  price: "",
  tags: "Seasonal",
};

export default function ChefScreen() {
  const router = useRouter();
  const { chefOrders, alerts, publishedMenu } = useAppStore();
  const [draft, setDraft] = useState(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [publishMessage, setPublishMessage] = useState("Published to customer menu");

  const handleSaveDish = () => {
    if (!draft.name.trim() || !draft.description.trim() || !draft.price) {
      return;
    }

    const price = Number(draft.price);
    const parsedTags = draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const tags: Preference[] = parsedTags.length ? (parsedTags as Preference[]) : ["Seasonal"];

    const baseItem = {
      id: editingId ?? `menu-${Date.now()}`,
      name: draft.name.trim(),
      description: draft.description.trim(),
      price,
      accent: editingId
        ? publishedMenu.find((item) => item.id === editingId)?.accent ?? "#E7C67A"
        : ["#E7C67A", "#C9D9B1", "#D7B892", "#B48F75"][publishedMenu.length % 4],
      tags,
      prepMinutes: Math.max(8, Math.min(30, Math.round(price / 2))),
      step: editingId
        ? publishedMenu.find((item) => item.id === editingId)?.step ?? publishedMenu.length + 1
        : publishedMenu.length + 1,
    };

    if (editingId) {
      updateMenuItem(editingId, baseItem);
    } else {
      addMenuItem(baseItem);
    }

    setDraft(blankDraft);
    setEditingId(null);
    setPublishMessage("Menu updated and ready to publish");
  };

  const handleEditDish = (courseId: string) => {
    const item = publishedMenu.find((course) => course.id === courseId);
    if (!item) {
      return;
    }

    setEditingId(item.id);
    setDraft({
      name: item.name,
      description: item.description,
      price: String(item.price),
      tags: item.tags.join(", "),
    });
  };

  const handlePublish = () => {
    setPublishedMenu(publishedMenu);
    setPublishMessage("Published to the customer menu");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="labelLarge" style={styles.kicker}>Chef View</Text>
            <Text style={styles.title}>Service board</Text>
          </View>
          <Button mode="contained" onPress={() => router.push("/chef-login")} buttonColor="#d8b777" textColor="#1d1713">
            Logout
          </Button>
        </View>

        <View style={styles.summaryRow}>
          <Surface style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{chefOrders.length}</Text>
            <Text style={styles.summaryLabel}>Current</Text>
          </Surface>
          <Surface style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{chefOrders.filter((order) => order.status === "Ready").length}</Text>
            <Text style={styles.summaryLabel}>Ready</Text>
          </Surface>
          <Surface style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{alerts.filter((alert) => alert.overdue).length}</Text>
            <Text style={styles.summaryLabel}>Alerts</Text>
          </Surface>
        </View>

        <Surface style={styles.panel}>
          <Text style={styles.panelTitle}>Kitchen alerts</Text>
          {alerts.length ? (
            alerts.map((alert) => (
              <View key={alert.id} style={[styles.alertRow, alert.overdue && styles.alertRowOverdue]}>
                <View style={[styles.alertDot, alert.overdue && styles.alertDotOverdue]} />
                <Text style={styles.alertText}>{alert.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No current kitchen alerts.</Text>
          )}
        </Surface>

        <Surface style={styles.panel}>
          <Text style={styles.panelTitle}>Current orders</Text>
          {chefOrders.length ? (
            chefOrders.map((order) => (
              <Card
                key={order.id}
                mode="contained"
                onPress={() => {
                  if (order.status === "Ready") {
                    serveChefOrder(order.id);
                    return;
                  }
                  cycleChefOrderStatus(order.id);
                }}
                style={styles.orderCard}
              >
                <Card.Content style={styles.orderCardContent}>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderName}>{order.items.join(" / ")}</Text>
                    <Text style={styles.orderTime}>{order.preferences.join(" • ")}</Text>
                    <Text style={styles.orderTime}>{order.estimateMinutes} min target</Text>
                  </View>
                  <View style={[styles.statusBadge, order.status === "Ready" && styles.statusBadgeReady]}>
                    <Text style={styles.statusText}>{order.status === "Ready" ? "Serve" : order.status}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyText}>No active orders in queue.</Text>
          )}
        </Surface>

        <Surface style={styles.panel}>
          <View style={styles.menuHeader}>
            <Text style={styles.panelTitle}>Menu editor</Text>
            <Button mode="contained" onPress={handlePublish} buttonColor="#d8b777" textColor="#1d1713">
              Publish
            </Button>
          </View>

          <Text style={styles.publishNote}>{publishMessage}</Text>

          {publishedMenu.map((course) => (
            <View key={course.id} style={styles.menuItem}>
              <View style={styles.menuItemTextWrap}>
                <Text style={styles.menuItemTitle}>{course.name}</Text>
                <Text style={styles.menuItemSub}>{course.tags.join(" • ")} • ${course.price}</Text>
              </View>
              <View style={styles.menuActions}>
                <Button mode="contained" compact onPress={() => handleEditDish(course.id)} buttonColor="#d8b777" textColor="#1d1713">
                  Edit
                </Button>
                <Button mode="contained" compact onPress={() => removeMenuItem(course.id)} buttonColor="#3b2a28" textColor="#f8f1ea">
                  Delete
                </Button>
              </View>
            </View>
          ))}

          <Card mode="contained" style={styles.formBox}>
            <Card.Content>
              <Text style={styles.formTitle}>{editingId ? "Edit dish" : "Add a dish"}</Text>

              <TextInput
                label="Dish name"
                value={draft.name}
                onChangeText={(value) => setDraft((current) => ({ ...current, name: value }))}
                mode="outlined"
                style={styles.input}
                textColor="#f8f1ea"
                outlineColor="#3b2f2a"
                activeOutlineColor="#d8b777"
              />

              <TextInput
                label="Description"
                value={draft.description}
                onChangeText={(value) => setDraft((current) => ({ ...current, description: value }))}
                mode="outlined"
                multiline
                style={styles.input}
                textColor="#f8f1ea"
                outlineColor="#3b2f2a"
                activeOutlineColor="#d8b777"
              />

              <TextInput
                label="Price"
                value={draft.price}
                onChangeText={(value) => setDraft((current) => ({ ...current, price: value }))}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                textColor="#f8f1ea"
                outlineColor="#3b2f2a"
                activeOutlineColor="#d8b777"
              />

              <TextInput
                label="Tags"
                value={draft.tags}
                onChangeText={(value) => setDraft((current) => ({ ...current, tags: value }))}
                mode="outlined"
                style={styles.input}
                textColor="#f8f1ea"
                outlineColor="#3b2f2a"
                activeOutlineColor="#d8b777"
              />

              <Button mode="contained" onPress={handleSaveDish} buttonColor="#d8b777" textColor="#1d1713" style={styles.saveButton}>
                {editingId ? "Save dish" : "Add dish"}
              </Button>
            </Card.Content>
          </Card>
        </Surface>
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
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  summaryCard: { flex: 1, backgroundColor: "#1d1713", borderWidth: 1, borderColor: "#352c28", borderRadius: 18, padding: 14, marginRight: 10, alignItems: "center" },
  summaryNumber: { color: "#f6d79d", fontSize: 28, fontWeight: "800" },
  summaryLabel: { color: "#d9c9b8", marginTop: 4, fontSize: 12 },
  panel: { backgroundColor: "#1b1512", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "#332821", marginBottom: 18 },
  panelTitle: { color: "#f8f1ea", fontSize: 18, fontWeight: "800" },
  alertRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#312923" },
  alertRowOverdue: { backgroundColor: "rgba(214,87,87,0.08)", borderRadius: 12 },
  alertDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#d8b777", marginRight: 10 },
  alertDotOverdue: { backgroundColor: "#ff7676" },
  alertText: { color: "#efe7df", flex: 1, fontSize: 13, lineHeight: 18 },
  orderCard: { backgroundColor: "#201915", borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: "#382d28" },
  orderCardContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  orderMeta: { flex: 1, paddingRight: 8 },
  orderName: { color: "#fffaf4", fontSize: 16, fontWeight: "700" },
  orderTime: { color: "#d7c7b7", fontSize: 12, marginTop: 4 },
  statusBadge: { backgroundColor: "#e3c27f", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  statusBadgeReady: { backgroundColor: "#d8b777" },
  statusText: { color: "#1d1713", fontWeight: "800", fontSize: 12 },
  emptyText: { color: "#d9c9b8", fontSize: 13 },
  menuHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  publishNote: { color: "#f2cf8a", fontSize: 12, marginBottom: 12 },
  menuItem: { backgroundColor: "#201915", borderRadius: 16, padding: 12, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuItemTextWrap: { flex: 1, paddingRight: 10 },
  menuItemTitle: { color: "#f8f1ea", fontSize: 15, fontWeight: "800" },
  menuItemSub: { color: "#d7c7b7", fontSize: 12, marginTop: 4 },
  menuActions: { flexDirection: "row", gap: 6 },
  formBox: { backgroundColor: "#1d1713", borderRadius: 18, marginTop: 12, borderWidth: 1, borderColor: "#362d29" },
  formTitle: { color: "#f8f1ea", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  input: { backgroundColor: "#201915", marginBottom: 12 },
  saveButton: { marginTop: 6, borderRadius: 12 },
});
