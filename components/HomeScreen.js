import { Text, TouchableOpacity, View } from "react-native";

const HomeScreen = ({ navigation, route }) => {
  // const gmail = route.params.gmail;
  // const gmail = route.params.dummyObject.gmail;
  // const password = route.params.dummyObject.password;
  return (
    <View>
      <Text>Home Screen</Text>
      {/* <Text>{gmail}</Text>
      <Text>{password}</Text> */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Details");
        }}
      >
        <Text>Details -{">"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
