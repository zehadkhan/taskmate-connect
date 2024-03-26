import { Text, TouchableOpacity, View } from "react-native";

const DetailsScreen = ({ navigation, route }) => {
  
  return (
    <View>
      <Text>Details Screen </Text>
      
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Text>Home -{">"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailsScreen;
