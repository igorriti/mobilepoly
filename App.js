import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from './screens/Home';
import PlayersConfig from './screens/PlayersConfig';
import BankMenu from './screens/BankMenu';
import Balance from './screens/Balance';
import Animation from './components/Animation';
import './src/translations/i18n';
import { Audio } from 'expo-av';
import React, { useEffect } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    let bgSound;

    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });

        const { sound } = await Audio.Sound.createAsync(
          require('./assets/sounds/bg.mp3'),
          { 
            shouldPlay: true, 
            isLooping: true,
            volume: 0.01 
          }
        );
        bgSound = sound;
      } catch (error) {
        console.log('Error setting up audio:', error);
      }
    }

    setupAudio();

    // Cleanup function
    return () => {
      if (bgSound) {
        bgSound.unloadAsync();
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="PlayersConfig" component={PlayersConfig} />
        <Stack.Screen name="BankMenu" component={BankMenu} />
        <Stack.Screen name="Balance" component={Balance} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


