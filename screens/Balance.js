import { View, Image, Text, StyleSheet, Animated, Pressable } from 'react-native';
import React,{useEffect, useState} from 'react'
import NfcManager,{ NfcTech, NfcEvents } from 'react-native-nfc-manager';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'; 
import keypad from "../assets/Keypad.png"
import webcam from "../assets/webcam.png"
import { useTranslation } from 'react-i18next';

export default function Balance({navigation,route}) {
  const { t } = useTranslation();
  const [animationValue] = useState(new Animated.Value(0));
  const [animationValue2] = useState(new Animated.Value(1));
  const [name, setName] = useState('');
  const [money, setMoney] = useState(0);

  const animation  =   Animated.loop(
    Animated.parallel([
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          
        }),
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          
        }),
        
      ]),
      Animated.sequence([
        Animated.timing(animationValue2, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          
        }),
        Animated.timing(animationValue2, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue2, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          
        }),
        
      ]),
    ])
  )

  const playsound = async () => {
    const {sound} = await Audio.Sound.createAsync(require('../assets/sounds/bank.mp3'));
  
    await sound.playAsync();
  }
  useEffect(() => {
    animation.start();
    NfcManager.start();
    NfcManager.registerTagEvent();

    return () => {
      NfcManager.unregisterTagEvent().catch(() => 0);
    
    };
  }, []);

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        playsound();
        const player = route.params.paramKey.find(player => player.nfcData === tag.id)
        if(player){
            setName(player["name"])
            setMoney(player["money"])
            setTimeout(() => {
            setName('')
            setMoney(0)
            animation.start();
            }, 6000);
        }
      })

    ;

  }, [NfcManager])
  
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => {navigation.navigate("BankMenu")}}>
        <Ionicons name="md-chevron-back-outline" size={24} color="white" />
        <Text style={{color:"white", fontSize : 20}}>{t('common.bank')}</Text>
      </Pressable>
      <View style={styles.cameraContainer}>
        <Image style={{width: 30, height: 30}} source={webcam} />
      </View>
      <View style={styles.screenContainer}>
        <View style={styles.displayContainer}>
          <View style={styles.displayTop}>
            {
              name === '' ?
                <Animated.Text style={[styles.displayText, {opacity : animationValue2}]}>
                  {t('bank.currentBalance')}...
                </Animated.Text>
              :
                <Text style={styles.displayText}>
                  {name} - {t('bank.currentBalance')}
                </Text>
            }
          </View>
          <View style={styles.displayBottom}>
            {name !== '' && 
              <Text style={styles.displayText}>$ {money}</Text>
            }
          </View>
        </View>
      </View>
      <View style={styles.scannerContainer}>
        <View style={styles.moneyHole}>
          <View style={{width: '100%', height: '25%', backgroundColor: 'black', opacity: 0.7}} />
        </View>
        <View style={styles.cardScanner}>
          <View style={styles.cardBg} />
          <Animated.View style={[styles.light, {opacity : animationValue}]} />
          <View style={{width: '80%', height: '25%', backgroundColor: 'black', opacity: 0.9, borderRadius: 5}} />
        </View>
      </View>
      <View style={styles.keypadContainer}>
        <View style={styles.buttonsBottom}>
          <Image style={styles.buttons} source={keypad} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-end",
        backgroundColor: '#808080',
    },
    backButton: {
      position: 'absolute',
      top: 10,
      left: 0, 
      zIndex: 1,
      flexDirection: 'row',
      alignItems : 'center',
      justifyContent: 'center',
    },
    cameraContainer: {
      height: 70,
      width: '100%',
      alignItems: 'center',
      justifyContent : 'center',
      borderTopWidth: 4,
      borderBottomWidth: 4,
    
      borderColor: '#606060',
    },
    screenContainer: {
      height: 230,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'white',
      borderTopWidth: 4,
      borderBottomWidth: 4,
    
      borderColor: '#606060',
    },
    displayContainer: {
      height: 200,
      width: '80%',
      backgroundColor: '#0000CD',
      borderRadius: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    displayText:  {
      color : '#fff',
      fontSize: 20,
      textAlign: 'center',
    },
    scannerContainer :{
      width: '100%',
      height: 120,
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'space-evenly'
    },
    moneyHole: {
      height: 35,
      width: '45%',
      backgroundColor: '#707070',
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderBottomColor: '#676767',
      borderTopColor: '#676767',
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderRightColor: '#909090',
      borderLeftColor: '#909090',
      

    },
    cardScanner: {
      height: 50,
      width: '30%',
      borderRadius: 10,
      backgroundColor: '#959595',
      borderWidth: 2,
      borderColor: '#a1a1a1',
      alignItems: 'center',
      justifyContent: 'center',

    },
    light: {
      position: 'absolute',
      top: 10,
      left: 70, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'green', 
      width: 5, 
      height: 5,
      borderRadius: 50,

    },
    cardBg :{
      position: 'absolute',
      top: 0,
      left: '33%', 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'grey',
      width: '33%',
      borderRadius: 1,
    },
    keypadContainer:{
      height: 200,
      width: '100%',
      backgroundColor: '#676767',
      //Add a shadow at the top
      borderTopColor: '#707070',
      borderTopWidth: 4,
      // shadowColor: 'black',
      // shadowOffset: { width: 0, height: 15 },
      // shadowOpacity: 1,
      // shadowRadius: 1,
      // elevation: 35,
    },
    buttonsBottom:{
      flex : 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttons:{
      height:120,
      width: '80%',
      marginBottom: 20,
      
    }
  });