import { View, Text, Pressable, StyleSheet, TextInput, ImageBackground } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager,{ NfcTech } from 'react-native-nfc-manager';
import { Audio } from 'expo-av';
import PlayerSelector from '../components/PlayerSelector';
import BottomPopUp from '../components/BottomPopUp';
import TransactionPopUp from '../components/TransactionPopUp';
import { MaterialIcons, FontAwesome5,Ionicons  } from '@expo/vector-icons';
import bgMono from '../assets/bgMono.png';
import { useTranslation } from 'react-i18next';

NfcManager.start();

export default function BankMenu({navigation}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [pay, setPay] = useState(false);
  const [pay2, setPay2] = useState(false);

  const [deposit, setDeposit] = useState(false);
  const [scanning , setScanning] = useState(false);
  const [operationStatus , setOperationStatus] = useState(false);
  const [players, setPlayers] = useState([]);
  const [payingPlayer, setPayingPlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [name, setName] = useState(null);
  const [error, setError] = useState(false);
  // const [money, setMoney] = useState(0);
  const money = useRef(0)

  const changeText = (text) => {
    money.current = text

  }
  const handlePay = () => {
    setShow(true);
    setPay(true);
    setDeposit(false)
  }

  const handleDeposit = () => {
    setShow(true)
    setPay(false)
    setDeposit(true)
  }

  const bankruptcy = () => {
    setPlayers(players.filter((player) => player.nfcData !== payingPlayer.nfcData))
    setPayingPlayer(null)
    setOperationStatus(false)
  }
 
  const payPlayer = async () => {
    setScanning(true);

    await NfcManager.requestTechnology(NfcTech.Ndef);

    const tag = await NfcManager.getTag();
    await NfcManager.cancelTechnologyRequest();
  
    const player = players.filter((player) => player.nfcData === tag.id)[0];
    if (player.nfcData === selectedPlayer.nfcData) {
      setScanning(false);
    } else {
      try {
        if (player.money < money.current) {
          setPayingPlayer(player)
          setError(true);
          const {sound} = await Audio.Sound.createAsync(require('../assets/sounds/error.mp3'));
  
          await sound.playAsync();
          setScanning(false);
          setOperationStatus(true)
          setError(false)

        } else {

          let newPlayers = players.map((player) => {
            if (player.nfcData === tag.id) {
              player.money -= parseInt(money.current)} 
            else if (player.nfcData === selectedPlayer.nfcData) {
              player.money += parseInt(money.current)
            }
            return player;
          })
          setPlayers(newPlayers);
          setScanning(false);
          setName(selectedPlayer.name)
          const {sound} = await Audio.Sound.createAsync(require('../assets/sounds/success.mp3'));
  
          await sound.playAsync();
          setPay2(true)
          setOperationStatus(true)
          setTimeout(() => {
            setOperationStatus(false)
            setPay2(false)
          }, 3000);
          setPay(false)

          setSelectedPlayer(null)

        }
      }
      catch (error) {
      }
    }


  }

  const depositPlayer = async () => {

    setScanning(true);
    const newPlayers = players.map((player) => {
      if (player.nfcData === selectedPlayer.nfcData) {
        player.money += parseInt(money.current)
      }
      return player;
    })
    setPlayers(newPlayers);
    setScanning(false);
    setPlayers(newPlayers);
    setName(selectedPlayer.name)
    const {sound} = await Audio.Sound.createAsync(require('../assets/sounds/success.mp3'));
    await sound.setVolumeAsync(0.03);
    await sound.playAsync();
    setOperationStatus(true)
    setTimeout(() => {
      setOperationStatus(false)
    }, 3000);
    setDeposit(false)
    setSelectedPlayer(null)




  }
  
  useEffect(() => {
    // Get the players from the storage
    AsyncStorage.getItem('game').then((game) => {
      game = JSON.parse(game);
      setPlayers(game.players);
    })

    // setPlayers([{name: 'Jugador 0', nfcData: '0F9BD155', money : 1000}, {name: 'Jugador 2', nfcData: '3', money : 1000}])
  }, [])

  useEffect(() => {
    if (pay) {
      payPlayer();
    }
    else  if (deposit) {
      depositPlayer();
    }

  }, [selectedPlayer])

  useEffect(() => {
    AsyncStorage.getItem('game').then((game) => {
      game = JSON.parse(game);
      game.players = players;
      AsyncStorage.setItem('game', JSON.stringify(game));
    })
    // console.log(players)
  }, [players])

  return (
    <>
      
      <View style={styles.container}>
      <ImageBackground  source={bgMono} resizeMode="cover" style={styles.backgroundImage}/>

        <Pressable style={styles.backButton} onPress={() => {navigation.navigate("Home")}}>
          <Ionicons name="md-chevron-back-outline" size={24} color="white" />
          <Text style={{color:"white", fontSize : 20}}>{t('common.home')}</Text>
        </Pressable>
        <PlayerSelector show={show} setShow={setShow} pay={pay} setPlayer={setSelectedPlayer} players={players}/>
        <BottomPopUp show={scanning} setShow={setScanning}/>
        <TransactionPopUp show={operationStatus} setShow={setOperationStatus} bankruptcy={bankruptcy} name={name} value={money.current} pay={pay2} error={error}/>
        <View style={styles.paymentsContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: "white", marginVertical: 10}}>
            {t('bank.moneyTo')}
          </Text>
          <TextInput style={styles.input} placeholder={t('bank.placeholder')} keyboardType='numeric' onChangeText={text => changeText(text)} value={0}/>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: "white", marginVertical: 10}}>
            {t('bank.transfer')}
          </Text>

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.buttonPayment} onPress={handlePay}>
              <MaterialIcons name="payment" size={24} color="white" />
              <Text style={styles.buttonText}>{t('bank.pay')}</Text>
            </Pressable>
            <Pressable style={[styles.buttonPayment, {backgroundColor : "#00BF5F"}]} onPress={handleDeposit}>
              <MaterialIcons name="local-atm" size={24} color="white" />
              <Text style={styles.buttonText}>{t('bank.receive')}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: "white",}}>
            {t('bank.currentBalance')}
          </Text>
          <Pressable style={styles.button} onPress={()=>{navigation.navigate('Balance', {paramKey : players})}}>
            <FontAwesome5 name="piggy-bank" size={24} color="white" />
            <Text style={styles.buttonText}>{t('common.balance')}</Text>
          </Pressable>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  paymentsContainer :{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceContainer :{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  input : {
    backgroundColor: 'white',
    width : 200,
    height : 50,
    borderRadius : 10,
    padding : 10,
    overflow: 'hidden',
  },

  buttonsContainer: {
    flexDirection: 'row',

  },

  buttonPayment: {
    width: 120,
    height: 50,
    backgroundColor: "#4A90E2",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,

    padding: 10,
    borderRadius: 20
    
  },
  button:{
  
    width: 200,
    height: 80,
    padding: 10,
    marginTop: 20,
    backgroundColor: "#FEB74B",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white'
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
  buttonText: {
    fontSize: 20,
    color: '#f1f1f1',
    textAlign: "center"

  }
});