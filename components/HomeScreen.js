import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Accordion from "./Accordion";
import { useState } from "react";

const HomeScreen = ({ navigation, route }) => {
  // const gmail = route.params.gmail;
  // const gmail = route.params.dummyObject.gmail;
  // const password = route.params.dummyObject.password;
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleTaskCreation = () => {
    if (taskTitle.trim() === "" || description.trim() === "") {
      setError("Please enter Task Title and Description");
      return;
    }

    console.log("Task Title:", taskTitle, "and detail:", description);

    // Reset error state
    setError("");
  };
  return (
    <View>
      {/* <Text>{gmail}</Text>
      <Text>{password}</Text> */}

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
            secureTextEntry
            value={description}
            onChangeText={setDescription}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Home");
              handleTaskCreation();
            }}
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

      <Accordion />
    </View>
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
    height:200,
    textAlignVertical: 'top',
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
