import { Text, View, StyleSheet, Pressable, Image, BackHandler} from 'react-native'
import React, { useEffect, useState }  from 'react'
import logo from '../assets/logo.png';
import Animation from '../components/Animation';
import { Audio} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home({navigation})  {
    const { t } = useTranslation();
    const [gameExist, setGameExist] = useState(false);

    const handlePress = async () => {
        try {
            const sound = new Audio.Sound();
            await sound.loadAsync(require('../assets/sounds/cash-register.mp3'));
            await sound.setVolumeAsync(0.03);
            await sound.playAsync();
            // Unload after playing
            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.didJustFinish) {
                    await sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    useEffect(() => {
        // Check for existing game
        AsyncStorage.getItem('game').then((value) => {
            if(value !== null){
                setGameExist(true);
            }
        });
    }, []);

    return (
        <>
            <Animation />
            <View style={styles.container}>
                <LanguageSwitcher />
                <Image
                   source={logo}
                   style={styles.logo} 
                />
                <Pressable
                    onPress={() => {
                        handlePress()
                        navigation.navigate('PlayersConfig')
                    }}
                    style={({pressed})=> [styles.pressable,{backgroundColor: pressed? "#E10000" : "#C70000"}]}
                >
                    <Text style={styles.pressableText}>{t('home.startGame')}</Text>
                </Pressable>
                
                <Pressable
                    onPress={() => {
                        BackHandler.exitApp();
                    }}
                    style={({pressed})=> [styles.pressable,{backgroundColor: pressed? "#E10000" : "#C70000"}]}
                >
                    <Text style={styles.pressableText}>{t('common.exit')}</Text>
                </Pressable>

                <Text style={styles.footer}>{t('home.madeWith')}</Text>
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
  
  