import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CompleteTaskScreen = () => {
  const [tasks, setTasks] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCompletedTasks, setUserCompletedTasks] = useState(null);
  const [effectCounter, setEffectCounter] = useState(0); 

  useEffect(() => {
    if (effectCounter < 4) {
      userDataFromAsyncStorage();
      getTasks();
    }
  }, [effectCounter]);

  useEffect(() => {
    if (userData && tasks) {
      const completedTasks = tasks.filter(
        (task) => parseInt(task.userId) === parseInt(userData.id)
      );
      setUserCompletedTasks(completedTasks);
    }
  }, [userData, tasks]);
  

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
    return fetch("https://taskmate-backend.onrender.com/completeTasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setEffectCounter(prevCounter => prevCounter + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // console.log("tasks", tasks);
  // console.log("userData", userData);
  // console.log("userCompletedTasks", userCompletedTasks);

  return (
    <ScrollView style={styles.container}>
      {userCompletedTasks && userCompletedTasks.length > 0 ? (
        userCompletedTasks.map((task) => (
          <View key={task.id}>
            <Text style={styles.TitleStyle}>{task?.task?.title}</Text>
            <Text style={styles.details}>{task?.task?.description}</Text>
            <View style={styles.buttonStyle}>
              <Button title="Completed" disabled color="#f194ff" />
            </View>
          </View>
        ))
      ) : (
        <Text>No completed tasks found for the current user.</Text>
      )}
    </ScrollView>
  );
};

export default CompleteTaskScreen;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 15,
    backgroundColor: "#fff",
  },
  TitleStyle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#303030",
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
