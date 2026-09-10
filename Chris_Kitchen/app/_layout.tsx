import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#d6b273",
    secondary: "#f2cf8a",
    background: "#120d0b",
    surface: "#1b1512",
    surfaceVariant: "#201915", 
    onSurface: "#f8f1ea",
    onPrimary: "#120d0b",
    outline: "#4a3a33",
    error: "#ff8a80",
  },
  roundness: 18,
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
