import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Accordion from "./Accordion";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation, route }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState();
  const [userData, setUserData] = useState();
  const [dedicatedTasks, setDedicatedTasks] = useState();

  useEffect(() => {
    userDataFromAsyncStorage();
    getTasks();
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

  const getTasks = () => {
    return fetch("https://taskmate-backend.onrender.com/tasks")
      .then((response) => response.json())
      .then((data) => {
        return setTasks(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log("Tasks: ", tasks);
  console.log("Task for student: ", dedicatedTasks);

  useEffect(() => {
    if(userData && tasks) {
      const assignedTasks = tasks.filter(
        (task) => parseInt(task.assignUser) === parseInt(userData.id)
      )
      setDedicatedTasks(assignedTasks);
    }
  }, [userData, tasks])

  const handleTaskCreation = async () => {
    try {
      if (taskTitle.trim() === "") {
        setError("Please enter task title");
        return;
      }
      if (description.trim() === "") {
        setError("Please enter description");
        return;
      }
      if (assignTo.trim() === "") {
        setError("Please enter student's id");
        return;
      }
      setError("");

      const response = await fetch(
        "https://taskmate-backend.onrender.com/tasks/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: taskTitle,
            description: description,
            creatorId: userData.id,
            assignUser: assignTo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTaskTitle("");
      setDescription("");
      setAssignTo("");

      getTasks();
    } catch (error) {
      console.error("Creating failed:", error);
      setError("Creating failed. Please try again.");
    }
  };

  return (
    <ScrollView>
      {userData && (
        <View style={{ marginLeft: 10, marginTop: 5, paddingLeft: 15 }}>
          <Text>Name: {userData?.userName}</Text>
          <Text>Id: {userData?.id}</Text>
          <Text>Role: {userData?.role}</Text>
        </View>
      )}

      {userData?.role === "teacher" && (
        <View style={{ backgroundColor: "#fff" }}>
          <View style={{ margin: 15 }}>
            <TextInput
              style={styles.textInput}
              placeholder="Task Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TextInput
              multiline={true}
              numberOfLines={10}
              style={styles.detailsInput}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Assign To"
              value={assignTo}
              onChangeText={setAssignTo}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              onPress={handleTaskCreation}
              style={styles.buttonStyle}
            >
              <Text style={styles.buttonTextStyle}>Create</Text>
              <Image
                style={styles.buttonIconImg}
                source={require("../assets/arrow.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {userData?.role === "teacher" &&
        tasks?.map((task) => (
          <Accordion navigation={navigation} tasks={task} key={task.id} />
        ))}
      {userData?.role === "student" &&
        dedicatedTasks?.map((task) => (
          <Accordion navigation={navigation} tasks={task} key={task.id} />
        ))}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  detailsInput: {
    width: "80%",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 200,
    textAlignVertical: "top",
  },
  textInput: {
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
