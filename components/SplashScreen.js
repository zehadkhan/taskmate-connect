import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useFonts, Inter_700Bold } from "@expo-google-fonts/inter";

const SplashScreen = () => {
  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.TagStyle}>TaskMate App</Text>
      <Image source={require("../assets/splash.png")} style={styles.logo} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  TagStyle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#303030",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
