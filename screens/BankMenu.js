import { View, Text, Pressable, StyleSheet, TextInput, ImageBackground, Alert } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import PlayerSelector from '../components/PlayerSelector';
import BottomPopUp from '../components/BottomPopUp';
import TransactionPopUp from '../components/TransactionPopUp';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import bgMono from '../assets/bgMono.png';
import { useTranslation } from 'react-i18next';
import { initNfc, startNfcScan, cleanUpNfc } from '../utils/nfcUtils';

export default function BankMenu({navigation}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [pay, setPay] = useState(false);
  const [pay2, setPay2] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [operationStatus, setOperationStatus] = useState(false);
  const [players, setPlayers] = useState([]);
  const [payingPlayer, setPayingPlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [name, setName] = useState(null);
  const [error, setError] = useState(false);
  const money = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem('game').then((game) => {
      game = JSON.parse(game);
      setPlayers(game.players);
    });

    return () => {
      cleanUpNfc();
    };
  }, []);

  useEffect(() => {
    if (pay && selectedPlayer) {
      scanNfcForPayment();
    } else if (deposit && selectedPlayer) {
      handleDeposit();
    }
  }, [selectedPlayer]);

  const changeText = (text) => {
    money.current = text;
  };

  const handlePay = () => {
    setShow(true);
    setPay(true);
    setDeposit(false);
  };

  const handleDeposit = async () => {
    setScanning(false);
    const newPlayers = players.map((player) => {
      if (player.nfcData === selectedPlayer.nfcData) {
        player.money += parseInt(money.current);
      }
      return player;
    });
    setPlayers(newPlayers);
    setName(selectedPlayer.name);
    setError(false);
    playSuccessSound();
    setOperationStatus(true);
    setTimeout(() => {
      setOperationStatus(false);
      setDeposit(false);
      setSelectedPlayer(null);
    }, 3000);
  };

  const handleScanCancel = () => {
    setScanning(false);
    setPay(false);
    setSelectedPlayer(null);
    cleanUpNfc();
  };

  const scanNfcForPayment = async () => {
    try {
      const isSupported = await initNfc();
      if (!isSupported) {
        console.warn('NFC not supported');
        return;
      }

      setScanning(true);

      const onTagFound = async (tag) => {
        const player = players.find((p) => p.nfcData === tag.id);
        
        // If no player found with this card, ignore
        if (!player) {
          return;
        }

        // If trying to pay to themselves, show error and stop
        if (player.nfcData === selectedPlayer.nfcData) {
          setScanning(false);
          setPay(false);
          setSelectedPlayer(null);
          Alert.alert(
            t('bank.paymentError'),
            t('bank.selfPaymentError'),
            [{ text: 'OK' }]
          );
          return;
        }

        // Stop scanning only after we've found a valid card
        setScanning(false);

        try {
          if (parseInt(player.money) < parseInt(money.current)) {
            // Handle insufficient funds
            setPayingPlayer(player);
            setError(true);
            setName(player.name);
            playErrorSound();
            setOperationStatus(true);
          } else {
            // Handle successful payment
            let newPlayers = players.map((p) => {
              if (p.nfcData === tag.id) {
                p.money = parseInt(p.money) - parseInt(money.current);
              } else if (p.nfcData === selectedPlayer.nfcData) {
                p.money = parseInt(p.money) + parseInt(money.current);
              }
              return p;
            });
            setPlayers(newPlayers);
            setError(false);
            setPay2(true);
            setName(selectedPlayer.name);
            playSuccessSound();
            setOperationStatus(true);
            setTimeout(() => {
              setOperationStatus(false);
              setPay2(false);
              setPay(false);
              setSelectedPlayer(null);
              setPayingPlayer(null);
            }, 3000);
          }
        } catch (error) {
          console.warn('Error processing payment:', error);
        }
      };

      const onIsoDepDetected = () => {
        // For ISO-DEP cards, restart the scan for the second read
        scanNfcForPayment();
      };

      await startNfcScan(onTagFound, onIsoDepDetected, 'bank');
    } catch (error) {
      console.warn('Error scanning NFC:', error);
      setScanning(false);
    }
  };

  const playSuccessSound = async () => {
    try {
      const {sound} = await Audio.Sound.createAsync(require('../assets/sounds/success.mp3'));
      await sound.setVolumeAsync(0.03);
      await sound.playAsync();
    } catch (error) {
      console.warn('Error playing success sound:', error);
    }
  };

  const playErrorSound = async () => {
    try {
      const {sound} = await Audio.Sound.createAsync(require('../assets/sounds/error.mp3'));
      await sound.playAsync();
    } catch (error) {
      console.warn('Error playing error sound:', error);
    }
  };

  const bankruptcy = () => {
    setPlayers(players.filter((player) => player.nfcData !== payingPlayer.nfcData));
    setPayingPlayer(null);
    setError(false);
    setOperationStatus(false);
    setPay(false);
    setSelectedPlayer(null);
  };

  useEffect(() => {
    AsyncStorage.setItem('game', JSON.stringify({ players }));
  }, [players]);

  return (
    <>
      <View style={styles.container}>
        <ImageBackground source={bgMono} resizeMode="cover" style={styles.backgroundImage}/>
        <Pressable style={styles.backButton} onPress={() => {navigation.navigate("Home")}}>
          <Ionicons name="md-chevron-back-outline" size={24} color="white" />
          <Text style={{color:"white", fontSize: 20}}>{t('common.home')}</Text>
        </Pressable>
        <PlayerSelector show={show} setShow={setShow} pay={pay} setPlayer={setSelectedPlayer} players={players}/>
        <BottomPopUp show={scanning} setShow={handleScanCancel}/>
        <TransactionPopUp show={operationStatus} setShow={setOperationStatus} bankruptcy={bankruptcy} name={name} value={money.current} pay={pay2} error={error}/>
        <View style={styles.paymentsContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: "white", marginVertical: 10}}>
            {t('bank.enterAmount')}
          </Text>
          <TextInput style={styles.input} placeholder={t('bank.placeholder')} keyboardType='numeric' onChangeText={text => changeText(text)} value={0}/>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: "white", marginVertical: 10}}>
            {t('bank.selectTransaction')}
          </Text>

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.buttonPayment} onPress={handlePay}>
              <MaterialIcons name="payment" size={24} color="white" />
              <Text style={styles.buttonText}>{t('bank.pay')}</Text>
            </Pressable>
            <Pressable style={[styles.buttonPayment, {backgroundColor: "#00BF5F"}]} onPress={() => {
              setShow(true);
              setPay(false);
              setDeposit(true);
            }}>
              <MaterialIcons name="local-atm" size={24} color="white" />
              <Text style={styles.buttonText}>{t('bank.receive')}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: "white"}}>
            {t('bank.checkBalance')}
          </Text>
          <Pressable style={styles.button} onPress={()=>{navigation.navigate('Balance', {paramKey: players})}}>
            <FontAwesome5 name="piggy-bank" size={24} color="white" />
            <Text style={styles.buttonText}>{t('common.balance')}</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
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