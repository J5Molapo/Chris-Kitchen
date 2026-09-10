import { useRouter } from "expo-router";
import { Button, Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.logoWrap}>
          <View style={styles.flameOuter}>
            <View style={styles.flameInner} />
          </View>
        </View>

        <Text variant="labelLarge" style={styles.eyebrow}>EST. 2019 • CAPE TOWN</Text>

        <Text style={styles.title}>Chef Christoffel</Text>

        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerStar}>✦</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.subtitle}>A private dining experience, curated daily.</Text>

        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            onPress={() => router.push("/menu")}
            buttonColor="#d6b273"
            textColor="#120d0b"
            style={styles.primaryButton}
            labelStyle={styles.primaryButtonText}
          >
            I AM A GUEST
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push("/chef-login")}
            textColor="#f2e8dc"
            style={styles.secondaryButton}
            labelStyle={styles.secondaryButtonText}
          >
            CHEF PORTAL
          </Button>
        </View>

        <Surface style={styles.helpButton}>
          <Button
            mode="contained"
            onPress={() => router.push("/chef-login")}
            buttonColor="#f3eee7"
            textColor="#120d0b"
            compact
            style={styles.helpButtonInner}
            labelStyle={styles.helpText}
          >
            ?
          </Button>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f0b09",
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#0f0b09",
    position: "relative",
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  flameOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#d6a14d",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#d6a14d",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ rotate: "180deg" }],
  },
  flameInner: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#f6c86b",
    position: "absolute",
    top: 12,
    left: 17,
    transform: [{ rotate: "45deg" }],
  },
  eyebrow: {
    color: "#d6b273",
    fontSize: 14,
    letterSpacing: 3,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 18,
  },
  title: {
    color: "#f3eee7",
    fontSize: 58,
    lineHeight: 64,
    letterSpacing: -2,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Georgia",
  },
  dividerWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  dividerLine: {
    width: 84,
    height: 1,
    backgroundColor: "#d6b273",
    opacity: 0.75,
  },
  dividerStar: {
    color: "#d6b273",
    fontSize: 18,
    marginHorizontal: 14,
    lineHeight: 18,
  },
  subtitle: {
    color: "#e7dccd",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 32,
    fontFamily: "Georgia",
  },
  buttonGroup: {
    width: "100%",
    maxWidth: 380,
    gap: 14,
  },
  primaryButton: {
    borderRadius: 10,
    width: "100%",
  },
  primaryButtonText: {
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "700",
    fontFamily: "Georgia",
  },
  secondaryButton: {
    borderRadius: 10,
    width: "100%",
    borderColor: "#d6b273",
  },
  secondaryButtonText: {
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "700",
    fontFamily: "Georgia",
  },
  helpButton: {
    position: "absolute",
    right: 22,
    bottom: 22,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#f3eee7",
  },
  helpButtonInner: {
    borderRadius: 22,
    width: 42,
    height: 42,
  },
  helpText: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 28,
  },
});
