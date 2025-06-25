import { useState } from "react";
import { BASE_URL } from '@env';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthColor = 
    passwordStrength <= 1 ? "#dc3545" :
    passwordStrength <= 2 ? "#ffc107" :
    passwordStrength <= 3 ? "#17a2b8" :
    passwordStrength <= 4 ? "#28a745" : "#28a745";

  const passwordStrengthText = 
    passwordStrength <= 1 ? "Very Weak" :
    passwordStrength <= 2 ? "Weak" :
    passwordStrength <= 3 ? "Fair" :
    passwordStrength <= 4 ? "Good" : "Strong";

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time validation
  const getFieldError = () => {
    if (username.trim() === "") return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (email.trim() === "") return "Email is required";
    if (!isValidEmail(email)) return "Please enter a valid email";
    if (password.trim() === "") return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (passwordStrength < 3) return "Password is too weak";
    if (confirmPassword !== password) return "Passwords do not match";
    if (role.trim() === "") return "Please select a role";
    return null;
  };

  const handleSignUp = async () => {
    const fieldError = getFieldError();
    if (fieldError) {
      setError(fieldError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          email: email,
          password: password,
          role: role
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      // Store user data and navigate to home
      await AsyncStorage.setItem("userData", JSON.stringify(data));
      
      Alert.alert("Success", "Account created successfully! You can now log in.", [
        {
          text: "OK",
          onPress: () => {
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRole("");
            navigation.navigate("Login");
          }
        }
      ]);

    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="person-add" size={48} color="#FF6B35" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join TaskMate to get started</Text>
          </View>

          {/* Signup Form */}
          <View style={styles.formContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#dc3545" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthBar}>
                  <View 
                    style={[
                      styles.passwordStrengthFill, 
                      { 
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: passwordStrengthColor 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.passwordStrengthText, { color: passwordStrengthColor }]}>
                  {passwordStrengthText}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && (
              <View style={styles.passwordMatchContainer}>
                <Ionicons 
                  name={confirmPassword === password ? "checkmark-circle" : "close-circle"} 
                  size={16} 
                  color={confirmPassword === password ? "#28a745" : "#dc3545"} 
                />
                <Text style={[
                  styles.passwordMatchText, 
                  { color: confirmPassword === password ? "#28a745" : "#dc3545" }
                ]}>
                  {confirmPassword === password ? "Passwords match" : "Passwords don't match"}
                </Text>
              </View>
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => {
                  setRole(itemValue);
                  setError("");
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select Role" value="" />
                <Picker.Item label="Student" value="STUDENT" />
                <Picker.Item label="Teacher" value="TEACHER" />
              </Picker>
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                  <Ionicons name="person-add" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.backToLoginButton}
            disabled={loading}
          >
            <Text style={styles.backToLoginText}>Already have an account? Sign In</Text>
            <Ionicons name="arrow-back" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF3F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FCC",
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 16,
  },
  passwordToggle: {
    padding: 4,
  },
  passwordStrengthContainer: {
    marginBottom: 16,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    marginBottom: 4,
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: "500",
  },
  passwordMatchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  passwordMatchText: {
    fontSize: 12,
    marginLeft: 6,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  picker: {
    height: 50,
  },
  signUpButton: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  signUpButtonDisabled: {
    backgroundColor: "#ccc",
  },
  signUpButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    marginRight: 8,
  },
  backToLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  backToLoginText: {
    fontSize: 14,
    color: "#FF6B35",
    marginRight: 8,
  },
});
