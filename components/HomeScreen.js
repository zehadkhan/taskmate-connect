import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { BASE_URL } from '@env';
import { Picker } from "@react-native-picker/picker";
import Accordion from "./Accordion";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts, Inter_700Bold, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
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
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        setUserData(userData.user || userData);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}users`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      if (data == undefined) {
        return data;
      } else {
        setGetUser(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  console.log("Students: ", getUser);

  useEffect(() => {
    if (userData && getUser) {
      // Handle both uppercase and lowercase role values
      const studentUser = getUser.filter((user) => 
        user.role === "STUDENT" || user.role === "student"
      );
      setAssignValue(studentUser);
    }
  }, [userData, getUser]);

  console.log("Student User: ", assignValue);

  const getTasks = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}tasks`
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
        (task) => task.status === "COMPLETED"
      );

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
      setTasksAfterChangeStatus(tasksAfterChangeStatus); // Set the value
    }
  }, [tasks]);

  useEffect(() => {
    if (userData && tasks) {
      const assignedTasks = tasks.filter(
        (task) => task.assigneeId === parseInt(userData.id)
      );
      setDedicatedTasks(assignedTasks);
    }
  }, [userData, tasks]);

  useEffect(() => {
    if (userData && (userData?.role === "STUDENT" || userData?.role === "student") && dedicatedTasks) {
      const studentFilteredTasks = dedicatedTasks.filter(
        (studentTask) =>
          studentTask.assigneeId === parseInt(userData.id) &&
          studentTask.status === "COMPLETED"
      );

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
      if (!assignTo) {
        setError("Please select a student to assign the task");
        return;
      }

      setError("");

      const response = await fetch(
        `${BASE_URL}tasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: taskTitle,
            description: description,
            creatorId: userData.id,
            assigneeId: assignTo,
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
      setShowCreateForm(false);
      Alert.alert("Success", "Task created successfully!");

      getTasks();
    } catch (error) {
      console.error("Creating failed:", error);
      setError("Creating failed. Please try again.");
    }
  };

  const getTaskCount = () => {
    if (userData?.role === "TEACHER" || userData?.role === "teacher") {
      return tasksAfterChangeStatus?.length || 0;
    } else {
      return userTasksAfterChangeStatus?.length || 0;
    }
  };

  let [fontsLoaded] = useFonts({
    "Inter-Bold": Inter_700Bold,
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData?.userName?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userData?.userName || "User"}</Text>
              <Text style={styles.userRole}>
                {userData?.role?.charAt(0)?.toUpperCase() + userData?.role?.slice(1)?.toLowerCase() || "User"}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.completedButton}
            onPress={() => navigation.navigate("CompleteTask")}
          >
            <MaterialIcons name="task-alt" size={20} color="#FF6B35" />
            <Text style={styles.completedButtonText}>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getTaskCount()}</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {tasks?.filter(task => task.status === "COMPLETED")?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Create Task Section for Teachers */}
        {userData && (userData?.role === "TEACHER" || userData?.role === "teacher") && (
          <View style={styles.createTaskSection}>
            <TouchableOpacity 
              style={styles.createTaskButton}
              onPress={() => setShowCreateForm(!showCreateForm)}
            >
              <Ionicons 
                name={showCreateForm ? "remove-circle" : "add-circle"} 
                size={24} 
                color="#FF6B35" 
              />
              <Text style={styles.createTaskButtonText}>
                {showCreateForm ? "Cancel" : "Create New Task"}
              </Text>
            </TouchableOpacity>

            {showCreateForm && (
              <View style={styles.createTaskForm}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Task Title"
                  placeholderTextColor="#999"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  style={styles.detailsInput}
                  placeholder="Task Description"
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                />
                
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={assignTo}
                    onValueChange={(itemValue) => setAssignTo(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Student" value="" />
                    {assignValue?.map((user) => (
                      <Picker.Item
                        key={user.id}
                        label={`${user.userName} (ID: ${user.id})`}
                        value={user.id}
                      />
                    ))}
                  </Picker>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
                
                <TouchableOpacity onPress={handleTaskCreation} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Create Task</Text>
                  <Ionicons name="send" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="assignment" size={24} color="#333" />
            <Text style={styles.sectionTitle}>
              {userData?.role === "TEACHER" || userData?.role === "teacher" 
                ? "All Tasks" 
                : "My Tasks"
              }
            </Text>
          </View>

          {userData && (userData?.role === "TEACHER" || userData?.role === "teacher") && tasksAfterChangeStatus && (
            <View style={styles.tasksList}>
              {tasksAfterChangeStatus.map((task) => (
                <Accordion navigation={navigation} tasks={task} key={task.id} />
              ))}
            </View>
          )}

          {userData && (userData?.role === "STUDENT" || userData?.role === "student") && userTasksAfterChangeStatus && (
            <View style={styles.tasksList}>
              {userTasksAfterChangeStatus.map((task) => (
                <Accordion navigation={navigation} tasks={task} key={task.id} />
              ))}
            </View>
          )}

          {getTaskCount() === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="assignment-turned-in" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>No tasks available</Text>
              <Text style={styles.emptyStateSubtext}>
                {userData?.role === "TEACHER" || userData?.role === "teacher" 
                  ? "Create a new task to get started" 
                  : "Tasks will appear here when assigned"
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#FF6B35",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#FF6B35",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 2,
  },
  userRole: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  completedButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completedButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FF6B35",
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    color: "#FF6B35",
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#eee",
  },
  createTaskSection: {
    marginBottom: 20,
  },
  createTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createTaskButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FF6B35",
    marginLeft: 12,
  },
  createTaskForm: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    textAlignVertical: "top",
    minHeight: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  picker: {
    height: 50,
  },
  error: {
    color: "#dc3545",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#fff",
    marginRight: 8,
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
    marginLeft: 8,
  },
  tasksList: {
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
