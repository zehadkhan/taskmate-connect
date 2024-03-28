import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import SplashScreen from "./components/SplashScreen";
import { useFonts, Inter_700Bold } from "@expo-google-fonts/inter";

const Stack = createNativeStackNavigator();

export default function App() {
  const [person, setPerson] = useState(false);
  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const handleStart = () => {
    setPerson(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!person ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
        {person && (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Home",
                headerStyle: {
                  backgroundColor: "orange",
                },
                headerTintColor: "white",
              }}
            />
          </>
        )}
      </Stack.Navigator>
      {!person && (
        <View style={styles.container}>
          <TouchableOpacity onPress={handleStart} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Start</Text>
            <Image
              style={styles.buttonIconImg}
              source={require("./assets/arrow.png")}
            />
          </TouchableOpacity>
        </View>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    backgroundColor: "#fff",
    height: 39,
    width: 115,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 48,
    paddingLeft: 16,
    paddingRight: 4,
  },
  buttonTextStyle: {
    fontFamily: "Inter-Bold",
    fontSize: 12,
    color: "#000",
    letterSpacing: 3,
  },
  buttonIconImg: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
});
