import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import SignUpScreen from "./components/SignUpScreen";
import CompleteTaskScreen from "./components/CompleteTaskScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [person, setPerson] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
  });

  // Check for existing login data when app starts
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && (parsedUserData.user || parsedUserData.id)) {
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    setPerson(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      setIsLoggedIn(false);
      setPerson(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Show loading screen while checking login status
  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading TaskMate...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!person && !isLoggedIn ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : !isLoggedIn ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : null}
        
        {isLoggedIn && (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Home",
              headerStyle: {
                backgroundColor: "#FF6B35",
              },
              headerTintColor: "white",
              headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              ),
            }}
          />
        )}
        
        {person && !isLoggedIn && (
          <>
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: "Sign Up",
                headerStyle: {
                  backgroundColor: "#FF6B35",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="CompleteTask"
              component={CompleteTaskScreen}
              options={{
                title: "Complete Task",
                headerStyle: {
                  backgroundColor: "#FF6B35",
                },
                headerTintColor: "white",
              }}
            />
          </>
        )}
      </Stack.Navigator>
      
      {!person && !isLoggedIn && (
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
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
  logoutButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
