// LoginScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from './HomePage';

const Stack = createNativeStackNavigator();

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Perform validation (e.g., check if username and password are not empty)
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter username and password');
      return;
    }

    // Perform login logic (e.g., call an API to authenticate the user)
    // For demonstration, we're just logging the username and password
    console.log('Login with username:', username, 'and password:', password);
//    alert('Login successful!');






    // Reset error state
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login"  onPress={()=>{navigation.navigate("HomePage")}} />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
