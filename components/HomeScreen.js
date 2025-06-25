import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { BASE_URL } from '@env';
import { Picker } from "@react-native-picker/picker";
import Accordion from "./Accordion";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts, Inter_700Bold, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
// import notifee from '@notifee/react-native';

const HomeScreen = ({ navigation, route }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [points, setPoints] = useState("10");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState();
  const [userData, setUserData] = useState();
  const [dedicatedTasks, setDedicatedTasks] = useState();
  const [tasksAfterChangeStatus, setTasksAfterChangeStatus] = useState(null);
  const [userTasksAfterChangeStatus, setUserTasksAfterChangeStatus] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(null);
  const [userCompletedTasks, setUserCompletedTasks] = useState(null);

  const [getUser, setGetUser] = useState();
  const [assignValue, setAssignValue] = useState();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "completed"
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState(null);

  useEffect(() => {
    userDataFromAsyncStorage();
    getTasks();
    getUsers();
  }, []);

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
      const response = await fetch(`${BASE_URL}users`);
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

  useEffect(() => {
    if (userData && getUser) {
      // Handle both uppercase and lowercase role values
      const studentUser = getUser.filter((user) => 
        user.role === "STUDENT" || user.role === "student"
      );
      setAssignValue(studentUser);
    }
  }, [userData, getUser]);

  const getTasks = async () => {
    try {
      const response = await fetch(`${BASE_URL}tasks`);
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
      // Separate active and completed tasks
      const activeTasks = tasks.filter(task => task.status !== "COMPLETED");
      const completedTasksList = tasks.filter(task => task.status === "COMPLETED");
      
      setCompletedTasks(completedTasksList);

      if (userData?.role === "TEACHER" || userData?.role === "teacher") {
        setTasksAfterChangeStatus(activeTasks);
      } else {
        const assignedTasks = activeTasks.filter(
          (task) => task.assigneeId === parseInt(userData?.id)
        );
        setUserTasksAfterChangeStatus(assignedTasks);
      }

      if (userData?.role === "STUDENT" || userData?.role === "student") {
        const userCompleted = completedTasksList.filter(
          (task) => task.assigneeId === parseInt(userData?.id)
        );
        setUserCompletedTasks(userCompleted);
      }
    }
  }, [tasks, userData]);

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
      if (!deadline) {
        setError("Please set a deadline");
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
            deadline: deadline,
            points: parseInt(points),
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
      setDeadline("");
      setPoints("10");
      setShowCreateForm(false);
      Alert.alert("Success", "Task created successfully!");

      getTasks();
    } catch (error) {
      console.error("Creating failed:", error);
      setError("Creating failed. Please try again.");
    }
  };

  const handleTaskCompleted = () => {
    // Refresh tasks after completion
    getTasks();
  };

  const getTaskCount = () => {
    if (userData?.role === "TEACHER" || userData?.role === "teacher") {
      return tasksAfterChangeStatus?.length || 0;
    } else {
      return userTasksAfterChangeStatus?.length || 0;
    }
  };

  const getCompletedTaskCount = () => {
    if (userData?.role === "TEACHER" || userData?.role === "teacher") {
      return completedTasks?.length || 0;
    } else {
      return userCompletedTasks?.length || 0;
    }
  };

  const calculateTotalPoints = () => {
    const currentTasks = activeTab === "active" 
      ? (userData?.role === "TEACHER" || userData?.role === "teacher" 
          ? tasksAfterChangeStatus 
          : userTasksAfterChangeStatus)
      : (userData?.role === "TEACHER" || userData?.role === "teacher" 
          ? completedTasks 
          : userCompletedTasks);

    if (!currentTasks) return 0;

    return currentTasks.reduce((total, task) => {
      const taskPoints = task.points || 10;
      const now = new Date();
      const taskDeadline = task.deadline ? new Date(task.deadline) : null;
      
      // If task is completed, add points
      if (task.status === "COMPLETED") {
        return total + taskPoints;
      }
      
      // If task is active and past deadline, subtract points
      if (taskDeadline && now > taskDeadline && task.status !== "COMPLETED") {
        return total - taskPoints;
      }
      
      return total;
    }, 0);
  };

  const isTaskOverdue = (task) => {
    if (!task.deadline || task.status === "COMPLETED") return false;
    const now = new Date();
    const taskDeadline = new Date(task.deadline);
    return now > taskDeadline;
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
        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <MaterialIcons name="stars" size={24} color="#FFD700" />
            <Text style={styles.pointsTitle}>Total Points</Text>
          </View>
          <Text style={styles.pointsValue}>{calculateTotalPoints()}</Text>
          <Text style={styles.pointsSubtext}>
            {activeTab === "active" ? "Active Tasks" : "Completed Tasks"}
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getTaskCount()}</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getCompletedTaskCount()}</Text>
            <Text style={styles.statLabel}>Completed Tasks</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "active" && styles.activeTab]}
            onPress={() => setActiveTab("active")}
          >
            <MaterialIcons 
              name="pending-actions" 
              size={20} 
              color={activeTab === "active" ? "#FF6B35" : "#666"} 
            />
            <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>
              Active Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "completed" && styles.activeTab]}
            onPress={() => setActiveTab("completed")}
          >
            <MaterialIcons 
              name="task-alt" 
              size={20} 
              color={activeTab === "completed" ? "#FF6B35" : "#666"} 
            />
            <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>
              Completed Tasks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Create Task Section (Only for Teachers) */}
        {(userData?.role === "TEACHER" || userData?.role === "teacher") && activeTab === "active" && (
          <View style={styles.createTaskSection}>
            <TouchableOpacity
              style={styles.createTaskButton}
              onPress={() => setShowCreateForm(!showCreateForm)}
            >
              <MaterialIcons name="add-task" size={24} color="#FF6B35" />
              <Text style={styles.createTaskButtonText}>Create New Task</Text>
              <MaterialIcons 
                name={showCreateForm ? "expand-less" : "expand-more"} 
                size={24} 
                color="#FF6B35" 
              />
            </TouchableOpacity>

            {showCreateForm && (
              <View style={styles.createTaskForm}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Task Title"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
                <TextInput
                  style={styles.detailsInput}
                  placeholder="Task Description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
                <Text style={styles.pickerLabel}>Deadline</Text>
                <TouchableOpacity
                  style={styles.deadlinePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.deadlinePickerButtonText}>
                    {deadlineDate ? deadlineDate.toLocaleString() : 'Select Deadline'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={deadlineDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        // Save the date, but keep the time as now (or 00:00)
                        const newDate = new Date(selectedDate);
                        if (deadlineDate) {
                          newDate.setHours(deadlineDate.getHours());
                          newDate.setMinutes(deadlineDate.getMinutes());
                        }
                        setDeadlineDate(newDate);
                        setTimeout(() => setShowTimePicker(true), 200); // Show time picker next
                      }
                    }}
                  />
                )}
                {showTimePicker && (
                  <DateTimePicker
                    value={deadlineDate || new Date()}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) {
                        // Combine with the previously selected date
                        const newDate = new Date(deadlineDate || new Date());
                        newDate.setHours(selectedTime.getHours());
                        newDate.setMinutes(selectedTime.getMinutes());
                        setDeadlineDate(newDate);
                        setDeadline(newDate.toISOString()); // Save as ISO string for backend
                      }
                    }}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Points (default: 10)"
                  value={points}
                  onChangeText={setPoints}
                  keyboardType="numeric"
                />
                <Text style={styles.pickerLabel}>Assign To Student</Text>
                <View style={styles.pickerContainer}>
                  <SelectList
                    setSelected={setAssignTo}
                    data={assignValue?.map(user => ({ key: user.id, value: user.userName })) || []}
                    placeholder="Select Student"
                    searchPlaceholder="Search student..."
                    boxStyles={{ borderWidth: 0, backgroundColor: 'transparent' }}
                    dropdownStyles={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff' }}
                    inputStyles={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#333' }}
                    dropdownTextStyles={{ fontFamily: 'Inter-Regular', fontSize: 16, color: '#333' }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleTaskCreation}
                >
                  <Text style={styles.submitButtonText}>Create Task</Text>
                </TouchableOpacity>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
            )}
          </View>
        )}

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === "active" ? "Active Tasks" : "Completed Tasks"}
            </Text>
          </View>

          {activeTab === "active" && (
            <>
              {userData && (userData?.role === "TEACHER" || userData?.role === "teacher") && tasksAfterChangeStatus && (
                <View style={styles.tasksList}>
                  {tasksAfterChangeStatus.map((task) => (
                    <Accordion 
                      navigation={navigation} 
                      tasks={task} 
                      userData={userData} 
                      onTaskCompleted={handleTaskCompleted} 
                      key={task.id} 
                    />
                  ))}
                </View>
              )}

              {userData && (userData?.role === "STUDENT" || userData?.role === "student") && userTasksAfterChangeStatus && (
                <View style={styles.tasksList}>
                  {userTasksAfterChangeStatus.map((task) => (
                    <Accordion 
                      navigation={navigation} 
                      tasks={task} 
                      userData={userData} 
                      onTaskCompleted={handleTaskCompleted} 
                      key={task.id} 
                    />
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === "completed" && (
            <>
              {userData && (userData?.role === "TEACHER" || userData?.role === "teacher") && completedTasks && (
                <View style={styles.tasksList}>
                  {completedTasks.map((task) => (
                    <Accordion 
                      navigation={navigation} 
                      tasks={task} 
                      userData={userData} 
                      onTaskCompleted={handleTaskCompleted} 
                      key={task.id} 
                    />
                  ))}
                </View>
              )}

              {userData && (userData?.role === "STUDENT" || userData?.role === "student") && userCompletedTasks && (
                <View style={styles.tasksList}>
                  {userCompletedTasks.map((task) => (
                    <Accordion 
                      navigation={navigation} 
                      tasks={task} 
                      userData={userData} 
                      onTaskCompleted={handleTaskCompleted} 
                      key={task.id} 
                    />
                  ))}
                </View>
              )}
            </>
          )}

          {((activeTab === "active" && getTaskCount() === 0) || 
            (activeTab === "completed" && getCompletedTaskCount() === 0)) && (
            <View style={styles.emptyState}>
              <MaterialIcons name="assignment-turned-in" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>
                {activeTab === "active" ? "No active tasks" : "No completed tasks"}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {activeTab === "active" 
                  ? (userData?.role === "TEACHER" || userData?.role === "teacher" 
                      ? "Create a new task to get started" 
                      : "Tasks will appear here when assigned")
                  : "Completed tasks will appear here"
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
  pointsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pointsTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  pointsValue: {
    fontFamily: "Inter-Bold",
    fontSize: 36,
    color: "#FF6B35",
    marginBottom: 4,
  },
  pointsSubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#FFF3F0",
  },
  tabText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#FF6B35",
  },
  createTaskSection: {
    marginBottom: 20,
  },
  createTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flex: 1,
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
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 54,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
    backgroundColor: 'transparent',
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: "#dc3545",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
  },
  tasksList: {
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontFamily: "Inter-SemiBold",
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
  pickerLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  deadlinePickerButton: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'flex-start',
  },
  deadlinePickerButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
});
