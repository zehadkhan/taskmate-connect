import React, { useEffect, useState } from "react";
import { 
  Button, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator,
  RefreshControl 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '@env';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const CompleteTaskScreen = () => {
  const [tasks, setTasks] = useState(null);
  const [userData, setUserData] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (userData && tasks) {
      filterCompletedTasks();
    }
  }, [userData, tasks]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      userDataFromAsyncStorage(),
      getTasks()
    ]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterCompletedTasks = () => {
    if (!userData || !tasks) return;

    let filteredTasks = [];
    
    if (userData.role === "TEACHER" || userData.role === "teacher") {
      // Teachers see all completed tasks
      filteredTasks = tasks.filter(task => task.status === "COMPLETED");
    } else {
      // Students see only their completed tasks
      filteredTasks = tasks.filter(task => 
        task.status === "COMPLETED" && 
        task.assigneeId === parseInt(userData.id)
      );
    }
    
    setCompletedTasks(filteredTasks);
  };

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

  const getTasks = async () => {
    try {
      const response = await fetch(`${BASE_URL}tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading completed tasks...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {completedTasks && completedTasks.length > 0 ? (
        completedTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <MaterialIcons name="assignment-turned-in" size={24} color="#28a745" />
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>
            {task.description && (
              <Text style={styles.taskDescription}>{task.description}</Text>
            )}
            <View style={styles.taskMeta}>
              <View style={styles.pointsContainer}>
                <MaterialIcons name="stars" size={16} color="#FFD700" />
                <Text style={styles.pointsText}>{task.points || 10} pts</Text>
              </View>
              <View style={styles.statusContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="assignment-turned-in" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No completed tasks found</Text>
          <Text style={styles.emptySubtext}>
            {userData?.role === "TEACHER" || userData?.role === "teacher" 
              ? "Completed tasks will appear here" 
              : "Your completed tasks will appear here"
            }
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default CompleteTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
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
  taskCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
