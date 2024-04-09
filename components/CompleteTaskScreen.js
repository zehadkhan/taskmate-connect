/*
import { Button, ScrollView, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const CompleteTaskScreen = () => {
  const [tasks, setTasks] = useState();
  const [userData, setUserData] = useState();
  const [userCompletedTasks, setUserCompletedTasks] = useState();

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

  if(userData?.id === tasks?.assignTo){
    return setUserCompletedTasks(tasks);
  }
  console.log("userCompletedTasks", userCompletedTasks);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.TitleStyle}>{tasks?.title}</Text>
      <Text style={styles.details}>{tasks?.description}</Text>
      <View style={styles.buttonStyle}>
        <Button title="Done" disabled color="#f194ff" />
      </View>
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
*/

/*
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CompleteTaskScreen = () => {
  const [tasks, setTasks] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCompletedTasks, setUserCompletedTasks] = useState(null);

  useEffect(() => {
    userDataFromAsyncStorage();
    getTasks();
  }, []);

  useEffect(() => {
    if (userData && tasks) {
      const completedTask = tasks.find(
        (task) => task.assignTo?.id === userData.id
      );
      if (completedTask) {
        setUserCompletedTasks(completedTask);
      }
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
    return fetch("https://taskmate-backend.onrender.com/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log("CompleteTask Screen", tasks);
  console.log("userInfo", userData);
  console.log("userCompletedTasks", userCompletedTasks);

  return (
    <ScrollView style={styles.container}>
      {userCompletedTasks ? (
        <>
          <Text style={styles.TitleStyle}>{userCompletedTasks.title}</Text>
          <Text style={styles.details}>{userCompletedTasks.description}</Text>
          <View style={styles.buttonStyle}>
            <Button title="Done" disabled color="#f194ff" />
          </View>
        </>
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
*/

import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CompleteTaskScreen = () => {
  const [tasks, setTasks] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCompletedTasks, setUserCompletedTasks] = useState();

  useEffect(() => {
    userDataFromAsyncStorage();
    getTasks();
  }, []);
  //! This portion does not work properly
  useEffect(() => {
    if (userData) {
      const completedTask = tasks?.find(
        (tasks) => tasks.assignUser === userData.id
      );
      console.log(completedTask);
      if (completedTask) {
        return setUserCompletedTasks(completedTask);
      }
      
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
    return fetch("https://taskmate-backend.onrender.com/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log("CompleteTask Screen dew", tasks?.assignUser);
  console.log("userInfo dew", userData.id);
  console.log("userCompletedTasks dew", userCompletedTasks);

  return (
    <ScrollView style={styles.container}>
      {userCompletedTasks ? (
        <>
          <Text style={styles.TitleStyle}>{userCompletedTasks.title}</Text>
          <Text style={styles.details}>{userCompletedTasks.description}</Text>
          <View style={styles.buttonStyle}>
            <Button title="Done" disabled color="#f194ff" />
          </View>
        </>
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
