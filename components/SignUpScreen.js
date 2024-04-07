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
import { Picker } from "@react-native-picker/picker";
import { useFonts, Inter_700Bold } from "@expo-google-fonts/inter";

const SignUpScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");

  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const handleSignUp = () => {
    // Perform validation (e.g., check if username and password are not empty)
    if (username.trim() === "") {
      setError("Please enter username");
      return;
    }
    if (email.trim() === "") {
      setError("Please enter email");
      return;
    }
    if (password.trim() === "") {
      setError("Please enter password");
      return;
    }
    if (role.trim() === "") {
      setError("Please enter role");
      return;
    }

    // Perform login logic (e.g., call an API to authenticate the user)
    // For demonstration, we're just logging the username and password
    console.log(username, email, password, role);

    // Reset error state
    setError("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Account</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
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
      <Picker
        selectedValue={role}
        style={styles.input}
        onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
      >
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Student" value="student" />
        <Picker.Item label="Teacher" value="teacher" />
      </Picker>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
          handleSignUp();
        }}
        style={styles.buttonStyle}
      >
        <Text style={styles.buttonTextStyle}>Create</Text>
        <Image
          style={styles.buttonIconImg}
          source={require("../assets/arrow.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

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
