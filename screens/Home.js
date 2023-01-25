import { Text, View, StyleSheet, Pressable, Image, BackHandler} from 'react-native'
import React, { useEffect, useState }  from 'react'
import logo from '../assets/logo.png';

import Animation from '../components/Animation';

import { Audio} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({navigation})  {
    const [gameExist, setGameExist] = useState(false);
    const [sound,setSound] = useState(null);
    const handlePress = async () => {
        const {sound} = await Audio.Sound.createAsync(require('../assets/sounds/cash-register.mp3'));
        await sound.setVolumeAsync(0.03);

        await sound.playAsync();
    }

    useEffect(() => {
        async function playSound() {
            const sound = new Audio.Sound();
            try{
                await sound.loadAsync(require('../assets/sounds/bg.mp3'));
                await sound.setVolumeAsync(0.01);
                await sound.playAsync({ isLooping: true });
            }
            catch(error){
                console.error(error);
            }
        }
        playSound();

        //Search for a game in AsyncStorage 
        AsyncStorage.getItem('game').then((value) => {
            if(value !== null){
                setGameExist(true);
            }
        })
    },[]);

    useEffect(() => {
        return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);
    return (
        <>
            <Animation />
            <View style={styles.container}>
                <Image
                   source={logo}
                   style={styles.logo} 
                >

                </Image>
                {/* {
                    gameExist&&
                    <Pressable
                    onPress={() => {
                        handlePress()
                        navigation.navigate('BankMenu')
                        // sound.stopAsync();
                    }}
                    style={({pressed})=> [styles.pressable,{backgroundColor: pressed? "#E10000" : "#C70000"}]}
                    >
                        <Text style={styles.pressableText}>Reanudar juego</Text>
                    </Pressable>      
                } */}
                <Pressable
                    onPress={() => {
                        handlePress()
                        navigation.navigate('PlayersConfig')
                        // sound.stopAsync();
                    }}

                
                    style={({pressed})=> [styles.pressable,{backgroundColor: pressed? "#E10000" : "#C70000"}]}
                >
                    <Text style={styles.pressableText}>Iniciar juego</Text>
                </Pressable>
                
                {/* <Pressable
                    onPress={() => {
                    // Handle press event
                    }}

                    style={({pressed})=> [styles.pressable,{backgroundColor: pressed? "#E10000" : "#C70000"}]}
                >
                    <Text style={styles.pressableText}>Configuracion</Text>
                </Pressable> */}
                <Pressable
                    onPress={() => {
                        BackHandler.exitApp();
                    }}

                    
                    style={({pressed})=> [styles.pressable,{backgroundColor: pressed? "#E10000" : "#C70000"}]}
                >
                    <Text style={styles.pressableText}>Salir</Text>
                </Pressable>

                <Text style={styles.footer}>Hecho con ❤️ por Nacho Gorriti</Text>
            </View>
        </>

    )
  
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    pressable: {
      marginTop: 50,
      backgroundColor: '#C70000',
      borderColor: 'white',
      borderWidth: 3,
      borderRadius: 30,
      padding: 10,

    },

    pressableText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    padding: 1,
    width: 170,
    textAlign: 'center',
    },

    logo: {
        resizeMode: "contain",
        width: 400,
        height: 120,
    },

    footer: {
        position:"absolute",
        bottom:0,
        left:0,
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        padding: 1,
        width: "100%",
        textAlign: 'center',
        // textShadowColor: 'black', textShadowRadius: 5, textShadowOffset: { 
        //     width: 2,
        //     height: 2
        //   },
        // opacity: 0.9
    }
  });
  
  