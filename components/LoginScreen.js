/*
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts, Inter_700Bold } from "@expo-google-fonts/inter";

const LoginScreen = ({ navigation, route }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const handleLogin = () => { 
    // Perform validation (e.g., check if username and password are not empty)
    if (username.trim() === '') {
      setError('Please enter username');
      return;
    }
    if (password.trim() === '') {
      setError('Please enter password');
      return;
    }

    // Perform login logic (e.g., call an API to authenticate the user)
    // For demonstration, we're just logging the username and password
    console.log('Login with username:', username, 'and password:', password);

    // Reset error state
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
          handleLogin()
        }}
        style={styles.buttonStyle}
      >
        <Text style={styles.buttonTextStyle}>Login</Text>
        <Image
          style={styles.buttonIconImg}
          source={require("../assets/arrow.png")}
        />
      </TouchableOpacity>
      <Text style={{color: "red",}}>OR</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignUp");
        }}
        style={styles.signUpButtonStyle}
      >
        <Text style={styles.buttonTextStyle}>Sign up</Text>
        <Image
          style={styles.buttonIconImg}
          source={require("../assets/arrow.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
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
  signUpButtonStyle: {
    backgroundColor: "#fff",
    height: 39,
    width: 115,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
*/

import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts, Inter_700Bold } from "@expo-google-fonts/inter";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const handleLogin = async () => { 
    // Perform validation (e.g., check if email and password are not empty)
    if (email.trim() === '') {
      setError('Please enter email');
      return;
    }
    if (password.trim() === '') {
      setError('Please enter password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, 
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      // If login successful, navigate to Home screen
      navigation.navigate("Home");
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.buttonStyle}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.buttonTextStyle}>Login</Text>
            <Image
              style={styles.buttonIconImg}
              source={require("../assets/arrow.png")}
            />
          </>
        )}
      </TouchableOpacity>
      <Text style={{color: "red"}}>OR</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignUp");
        }}
        style={styles.signUpButtonStyle}
        disabled={loading}
      >
        <Text style={styles.buttonTextStyle}>Sign up</Text>
        <Image
          style={styles.buttonIconImg}
          source={require("../assets/arrow.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
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
  signUpButtonStyle: {
    backgroundColor: "#fff",
    height: 39,
    width: 115,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

