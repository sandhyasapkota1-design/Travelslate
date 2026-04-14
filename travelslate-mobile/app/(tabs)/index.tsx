import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TravelSlate ✈️</Text>
      <Text style={styles.subtitle}>
        Your travel feed will live here
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 First Step</Text>
        <Text style={styles.cardText}>
          We will build Instagram-style travel posts next
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#1e293b",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  cardText: {
    color: "#94a3b8",
    marginTop: 8,
  },
});
