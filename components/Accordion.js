import {
  TouchableWithoutFeedback,
  View,
  Text,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  useFonts,
  Inter_700Bold,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '@env';

const Accordion = ({ navigation, tasks }) => {
  const [open, setOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [userData, setUserData] = useState();
  const [error, setError] = useState("");
  const taskId = tasks.id;

  useEffect(() => {
    userDataFromAsyncStorage();
  }, []);

  const userDataFromAsyncStorage = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    console.log("Task ID: ", taskId);
    try {
      const responseCompleteTasks = await fetch(`${BASE_URL}completeTasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complete: true,
          taskId: taskId,
          userId: userData?.id,
        }),
      });
      const responseCompleteTasksData = await responseCompleteTasks.json();

      if (!responseCompleteTasks.ok) {
        throw new Error(responseCompleteTasksData.error || "Failed to complete task");
      }

      const response = await fetch(`${BASE_URL}tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completeTaskStatus: true,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete task");
      }

      Alert.alert("Success", "Task completed successfully!");
    } catch (error) {
      console.error("Completing failed:", error);
      setError("Completing failed. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}tasks/${taskId}`, {
                method: "DELETE",
              });
              if (response.ok) {
                Alert.alert("Success", "Task deleted successfully!");
              } else {
                console.error("Failed to delete task. Server responded with status:", response.status);
              }
            } catch (error) {
              console.error("Can't delete task", error);
            }
          },
        },
      ]
    );
  };

  const toggleAccordion = () => {
    if (!open) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setOpen(!open);
  };

  const heightAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const rotateAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FF6B35" />;
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.taskIcon}>
              <MaterialIcons name="assignment" size={24} color="#FF6B35" />
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.title} numberOfLines={2}>
                {tasks?.title}
              </Text>
              <Text style={styles.status}>
                Status: <Text style={styles.statusText}>Active</Text>
              </Text>
            </View>
            <Animated.View style={{ transform: [{ rotate: rotateAnimation }] }}>
              <AntDesign name="down" size={20} color="#666" />
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.content, { height: heightAnimationInterpolation }]}>
        <View style={styles.contentInner}>
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{tasks?.description}</Text>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                handleCompleteTask(taskId);
                navigation.navigate("CompleteTask");
              }}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            </TouchableOpacity>

            {(userData?.role === "TEACHER" || userData?.role === "teacher") && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(taskId)}
              >
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </Animated.View>
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF3F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
    lineHeight: 22,
  },
  status: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  statusText: {
    fontFamily: "Inter-SemiBold",
    color: "#28a745",
  },
  content: {
    overflow: "hidden",
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  actionsSection: {
    flexDirection: "row",
    gap: 12,
  },
  completeButton: {
    flex: 1,
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  completeButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#fff",
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#fff",
    marginLeft: 6,
  },
  error: {
    color: "#dc3545",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});
