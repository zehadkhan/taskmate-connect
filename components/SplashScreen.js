// SplashScreen.js
import React from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const handleStartPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/splash.png')} style={styles.logo} />
      <Button title="Start" onPress={handleStartPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;