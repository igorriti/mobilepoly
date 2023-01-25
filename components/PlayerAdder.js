import { View, Text, TextInput, Modal, Pressable, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import NfcManager,{ NfcTech } from 'react-native-nfc-manager';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import BottomPopUp from '../components/BottomPopUp';

export default function PlayerAdder({show, players,setPlayers, editing, index,nfcData,setNfcData, playerName, setPlayerName, reset }) {
    const [scanning , setScanning] = useState(false);

    const handleScanNfc = async () => {
        setNfcData('')
        try {
            if (!scanning){
                const isNfcSupported = await NfcManager.isSupported();
                if (isNfcSupported) {
                    await NfcManager.start();
                    setScanning(true);

                    await NfcManager.requestTechnology(NfcTech.Ndef);
                    const tag = await NfcManager.getTag();

                    setNfcData(tag.id)
                    await NfcManager.cancelTechnologyRequest();
                    setScanning(false);
    
    
                } else {
                  console.warn('This device does not support NFC');
                }
            }

          } catch (error) {
            console.warn(error);
          }
    }

    const handleDelete = () => {
        const newPlayers = [...players];
        newPlayers.splice(index,1);
        setPlayers(newPlayers);
        reset()
    }
    
    const handleOk = () => {
        if (playerName.length>=1 && nfcData !== ''){
            if (editing){
                const newPlayers = [...players];
                newPlayers[index] = {name : playerName, nfcData: nfcData, money: 1500 };
                setPlayers(newPlayers);
                reset()
            }
            else{
                setPlayers([...players, { name : playerName, nfcData: nfcData, money: 1500 }]);
                reset()
            }
        }
    };
    
    return (
        <Modal visible={show}  transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalBody}>
                    <Text style={styles.title}>Ingresa nombre de jugador:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setPlayerName(text)}
                        value={playerName}
                        placeholder="Nombre"
                    />
                    <Pressable style={[styles.button, {backgroundColor : '#4A90E2'}]} onPress={handleScanNfc}>
                        <MaterialCommunityIcons name="nfc" size={24} color="white" style={{marginRight:5}} />
                        <Text style={styles.buttonText}>Escanear NFC</Text>

                    </Pressable>
                    {nfcData !== '' && <Text style={[styles.buttonText, {color:"black"}]}>Su tarjeta ha sido escaneada exitosamente!</Text>}

                    <View style={styles.innerButtons} >
                        <Pressable style={styles.button} onPress={reset}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </Pressable>
                        {
                            editing&&
                            <Pressable style={styles.button} onPress={handleDelete}>
                                <MaterialIcons name="delete" size={24} color="white" />
                                <Text style={styles.buttonText}>Eliminar</Text>
                            </Pressable>
                        }
                        {
                            playerName.length>=1 && nfcData !== ''&&
                            <Pressable style={styles.button} onPress={handleOk}>
                                <Text style={styles.buttonText}>{editing? "Modificar" : "Agregar"}</Text>
                            </Pressable>
                        }

                    </View>

                </View>
            </View>
            <BottomPopUp 
                show={scanning}
                setShow={setScanning}
            />
        </Modal>
  )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBody: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        backgroundColor : 'white'
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    button: {
        backgroundColor: "#C70000",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    innerButtons: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
      },
    })