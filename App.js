import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from './screens/Home';
import PlayersConfig from './screens/PlayersConfig';
import BankMenu from './screens/BankMenu';
import Balance from './screens/Balance';
import Animation from './components/Animation';
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator  screenOptions={{headerShown: false}} initialRouteName="Home" >

          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="PlayersConfig" component={PlayersConfig} />
          <Stack.Screen name="BankMenu" component={BankMenu} />

          <Stack.Screen name="Balance" component={Balance} />

        </Stack.Navigator>


    </NavigationContainer>

  );
}


