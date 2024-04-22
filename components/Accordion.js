import {
  TouchableWithoutFeedback,
  View,
  Text,
  Animated,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native-web";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  useFonts,
  Inter_700Bold,
  Inter_400Regular,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const responseCompleteTasks = await fetch(
        "https://taskmate-backend.onrender.com/completeTasks/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complete: true,
            taskId: taskId,
            userId: userData?.id,
          }),
        }
      );
      const responseCompleteTasksData = await responseCompleteTasks.json();

      if (!responseCompleteTasks.ok) {
        throw new Error(
          responseCompleteTasksData.error || "Failed to complete task"
        );
      }

      const response = await fetch(
        `https://taskmate-backend.onrender.com/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completeTaskStatus: true,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete task");
      }

      Alert.alert("Task complete!");
    } catch (error) {
      console.error("Completing failed:", error);
      setError("Completing failed. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `https://taskmate-backend.onrender.com/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        Alert.alert("Task deleted!");
      } else {
        console.error(
          "Failed to delete task. Server responded with status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Can't delete task", error);
    }
  };

  //! This function is using for toggle the title
  const toggleAccordion = () => {
    if (!open) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
    setOpen(!open);
  };

  //! It's for task details area height
  const heightAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
    "Inter-Regular": Inter_400Regular,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.header}>
          <Text style={styles.TitleStyle}>{tasks?.title}</Text>
          <AntDesign
            name={open ? "caretdown" : "caretright"}
            size={20}
            color="black"
          />
        </View>
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.content, { height: heightAnimationInterpolation }]}
      >
        <Text style={styles.details}>{tasks?.description}</Text>
        <View style={styles.buttonStyle}>
          <Button
            title="Done"
            color="green"
            onPress={() => {
              handleCompleteTask(taskId);
              navigation.navigate("CompleteTask");
            }}
          />
        </View>
        {userData?.role === "teacher" && (
          <View style={styles.buttonStyle}>
            <Button
              title="Delete"
              color="red"
              onPress={() => {
                handleDeleteTask(taskId);
              }}
            />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    contentAlign: "center",
  },
  TitleStyle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#303030",
  },
  content: {
    marginTop: 8,
  },
  details: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "gray",
  },
  buttonStyle: {
    marginTop: 8,
  },
});
