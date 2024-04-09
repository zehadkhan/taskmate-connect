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

const Accordion = ({ tasks }) => {
  const [open, setOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // console.log("accordion", tasks);
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
            color="#f194ff"
            onPress={() => Alert.alert("Task complete!")}
          />
        </View>
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
