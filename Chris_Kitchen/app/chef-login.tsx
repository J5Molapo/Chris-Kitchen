import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Surface, Switch, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const chefCredentials = {
  email: "chef@chriskitchen.com",
  password: "kitchen123",
};

export default function ChefLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("chef@chriskitchen.com");
  const [password, setPassword] = useState("kitchen123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    const emailValid = /.+@.+\..+/.test(email.trim());
    const passwordValid = password.trim().length >= 6;
    return emailValid && passwordValid;
  }, [email, password]);

  const handleLogin = () => {
    if (!isValid) {
      setError("Enter a valid email and 6+ character password.");
      return;
    }

    if (email.trim().toLowerCase() !== chefCredentials.email || password !== chefCredentials.password) {
      setError("Invalid chef credentials. Try the demo login.");
      return;
    }

    setError("");
    router.push("/chef");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Button mode="text" onPress={() => router.push("/")} style={styles.backButton} textColor="#f8f1ea">
          ← Back
        </Button>

        <View style={styles.logoWrap}>
          <Text style={styles.logo}>CK</Text>
        </View>

        <Text variant="labelLarge" style={styles.kicker}>Chef access</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to manage orders, prep, and service.</Text>

        <Surface style={styles.formCard} elevation={0}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            mode="outlined"
            outlineColor="#3b2f2a"
            activeOutlineColor="#d8b777"
            textColor="#f8f1ea"
            style={styles.input}
            theme={{ colors: { primary: "#d8b777", background: "#201915", onSurfaceVariant: "#f8f1ea" } }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            outlineColor="#3b2f2a"
            activeOutlineColor="#d8b777"
            textColor="#f8f1ea"
            style={styles.input}
            theme={{ colors: { primary: "#d8b777", background: "#201915", onSurfaceVariant: "#f8f1ea" } }}
          />

          <View style={styles.rowBetween}>
            <View style={styles.rememberWrap}>
              <Switch value={rememberMe} onValueChange={setRememberMe} color="#d8b777" />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>

            <Button mode="text" compact onPress={() => {}} textColor="#f2c57d">
              Forgot password?
            </Button>
          </View>

          <HelperText type="error" visible={!!error} style={styles.errorText}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={!isValid}
            buttonColor="#d8b777"
            textColor="#201915"
            style={styles.primaryButton}
            labelStyle={styles.primaryButtonText}
          >
            Sign in as chef
          </Button>

          <Button
            mode="outlined"
            onPress={() => {
              setEmail(chefCredentials.email);
              setPassword(chefCredentials.password);
              setError("");
            }}
            style={styles.secondaryButton}
            textColor="#f8f1ea"
            labelStyle={styles.secondaryButtonText}
          >
            Use demo credentials
          </Button>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#120d0b" },
  container: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32, backgroundColor: "#120d0b" },
  backButton: { alignSelf: "flex-start", marginBottom: 18 },
  logoWrap: { width: 72, height: 72, borderRadius: 24, backgroundColor: "#d8b777", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  logo: { color: "#201915", fontSize: 28, fontWeight: "900" },
  kicker: { color: "#d8b777", letterSpacing: 1.6, textTransform: "uppercase", fontWeight: "700", fontSize: 12 },
  title: { marginTop: 8, color: "#f8f1ea", fontSize: 34, fontWeight: "800" },
  subtitle: { marginTop: 8, color: "#d9c9b8", fontSize: 14, lineHeight: 20 },
  formCard: { marginTop: 24, backgroundColor: "#1b1512", borderWidth: 1, borderColor: "#352c28", borderRadius: 28, padding: 18 },
  input: { backgroundColor: "#201915", marginBottom: 16 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  rememberWrap: { flexDirection: "row", alignItems: "center" },
  rememberText: { color: "#dfd2c5", marginLeft: 8, fontSize: 13 },
  errorText: { marginBottom: 0, color: "#ffb0a3" },
  primaryButton: { marginTop: 12, borderRadius: 16 },
  primaryButtonText: { fontWeight: "900", fontSize: 15 },
  secondaryButton: { marginTop: 12, borderRadius: 16, borderColor: "#3c312d" },
  secondaryButtonText: { fontWeight: "800", fontSize: 15 },
});
