import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Button,
  
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Accordion from "./Accordion";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SelectList } from "react-native-dropdown-select-list";
// import notifee from '@notifee/react-native';

const HomeScreen = ({ navigation, route }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState(null);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState();
  const [userData, setUserData] = useState();
  const [dedicatedTasks, setDedicatedTasks] = useState();
  const [tasksAfterChangeStatus, setTasksAfterChangeStatus] = useState(null);
  const [userTasksAfterChangeStatus, setUserTasksAfterChangeStatus] =
    useState(null);

  const [getUser, setGetUser] = useState();
  const [assignValue, setAssignValue] = useState();
  

  useEffect(() => {
    userDataFromAsyncStorage();
    getTasks();
    getUsers();
  }, [tasks]);

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

  const getUsers = async () => {
    try {
      const response = await fetch(
        "https://taskmate-backend.onrender.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      if (data == undefined) {
        return data;
      } else {
        setGetUser(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  console.log("Students: ", getUser);

  useEffect(() => {
    if (userData && getUser) {
      const studentUser = getUser.filter((role) => role.role === "student");
      setAssignValue(studentUser);
    }
  }, [userData, getUser]);

  console.log("Student User: ", assignValue);

  const getTasks = async () => {
    try {
      const response = await fetch(
        "https://taskmate-backend.onrender.com/tasks"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      if (data == undefined) {
        return data;
      } else {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (tasks) {
      const filteredTasks = tasks.filter(
        (task) => task.completeTaskStatus === true
      );
      //! console.log("Filter Data: ", filteredTasks);

      const arrayDiffByProperty = (arr1, arr2, property) => {
        return arr1.filter(
          (item1) => !arr2.some((item2) => item2[property] === item1[property])
        );
      };

      const tasksAfterChangeStatus = arrayDiffByProperty(
        tasks,
        filteredTasks,
        "id"
      );
      //! console.log("tasksAfterChangeStatus: ", tasksAfterChangeStatus);
      setTasksAfterChangeStatus(tasksAfterChangeStatus); // Set the value
    }
  }, [tasks]);

  //! console.log("object: ", tasksAfterChangeStatus);

  useEffect(() => {
    if (userData && tasks) {
      const assignedTasks = tasks.filter(
        (task) => parseInt(task.assignUser) === parseInt(userData.id)
      );
      setDedicatedTasks(assignedTasks);
    }
  }, [userData, tasks]);

  //! console.log("Dedicated task for student full Array A: ", dedicatedTasks);

  useEffect(() => {
    if (userData?.role === "student" && dedicatedTasks) {
      const studentFilteredTasks = dedicatedTasks.filter(
        (studentTask) =>
          studentTask.assignUser === userData.id &&
          studentTask.completeTaskStatus === true
      );
      //! console.log("Filter Data for student Array B: ", studentFilteredTasks);

      const arrayDiffByProperty = (arr1, arr2, property) => {
        return arr1.filter(
          (item1) => !arr2.some((item2) => item2[property] === item1[property])
        );
      };

      const tasksAfterChangeStatus = arrayDiffByProperty(
        dedicatedTasks,
        studentFilteredTasks,
        "id"
      );
      setUserTasksAfterChangeStatus(tasksAfterChangeStatus); // Set the value
    }
  }, [userData, dedicatedTasks]);

  //! console.log("User task for student result array C : ", userTasksAfterChangeStatus);

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

      {
        <View
          style={{
            marginLeft: 50,
            marginTop: 10,
            paddingLeft: 0,
            marginBottom: 20,
            width: 300,
          }}
        >
          <Button
            onPress={() => {
              navigation.navigate("CompleteTask");
            }}
            title="Show Completed Tasks"
            color="#841584"
            accessibilityLabel="View Completed Tasks"
          />
        </View>
      }

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
            {/* <TextInput
              style={styles.textInput}
              placeholder="Assign To"
              value={assignTo}
              onChangeText={setAssignTo}
            /> */}

            <Picker
              selectedValue={assignTo}
              onValueChange={(itemValue) => setAssignTo(itemValue)}
            >
              <Picker.Item label="Select Student" value="" />
              {assignValue?.map((user) => (
                <Picker.Item
                  key={user.id}
                  label={user.userName + " : " +  user.id}
                  value={user.id}
                />
              ))}
            </Picker>

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

          {/* {(
            <View>
              <Button title="Display Notification" onPress={() => {}} />
            </View>
          )} */}

          <View
            style={{ marginHorizontal: 10, marginTop: 10, marginBottom: 20 }}
          >
            <View
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "black",
                borderBottomColor: "black",
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                List Of All Tasks:
              </Text>
            </View>
          </View>
        </View>
      )}
      {userData?.role === "teacher" && tasksAfterChangeStatus && (
        <>
          {tasksAfterChangeStatus
            // Filter out completed tasks
            .map((task) => (
              <Accordion navigation={navigation} tasks={task} key={task.id} />
            ))}
        </>
      )}
      {userData?.role === "student" && userTasksAfterChangeStatus && (
        <>
          {/* <p>Number of tasks: {dedicatedTasks.length}</p> */}
          {userTasksAfterChangeStatus.map((task) => (
            <Accordion navigation={navigation} tasks={task} key={task.id} />
          ))}
        </>
      )}
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
