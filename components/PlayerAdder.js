import { View, Text, TextInput, Modal, Pressable, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import NfcManager,{ NfcTech } from 'react-native-nfc-manager';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import BottomPopUp from '../components/BottomPopUp';
import { useTranslation } from 'react-i18next';

export default function PlayerAdder({show, players,setPlayers, editing, index,nfcData,setNfcData, playerName, setPlayerName, reset }) {
    const { t } = useTranslation();
    const [scanning, setScanning] = useState(false);
    const [nfcError, setNfcError] = useState('');

    const handleScanNfc = async () => {
        setNfcData('')
        setNfcError('');
        try {
            if (!scanning){
                const isNfcSupported = await NfcManager.isSupported();
                if (isNfcSupported) {
                    await NfcManager.start();
                    setScanning(true);

                    await NfcManager.requestTechnology(NfcTech.Ndef);
                    const tag = await NfcManager.getTag();

                    // Check if this NFC card is already registered
                    const isDuplicate = players.some(player => 
                        player.nfcData === tag.id && (!editing || player.nfcData !== players[index]?.nfcData)
                    );

                    if (isDuplicate) {
                        setNfcError(t('players.nfcDuplicate'));
                    } else {
                        setNfcData(tag.id);
                    }

                    await NfcManager.cancelTechnologyRequest();
                    setScanning(false);
                } else {
                    console.warn('This device does not support NFC');
                    setNfcError(t('players.nfcNotSupported'));
                }
            }
        } catch (error) {
            console.warn(error);
            setNfcError(t('players.nfcError'));
            setScanning(false);
        }
    }

    const handleDelete = () => {
        const newPlayers = [...players];
        newPlayers.splice(index,1);
        setPlayers(newPlayers);
        reset()
    }
    
    const handleOk = () => {
        if (playerName.length >= 1 && nfcData !== '' && !nfcError){
            if (editing){
                const newPlayers = [...players];
                newPlayers[index] = {name: playerName, nfcData: nfcData, money: 1500};
                setPlayers(newPlayers);
                reset();
            } else {
                setPlayers([...players, {name: playerName, nfcData: nfcData, money: 1500}]);
                reset();
            }
        }
    };
    
    return (
        <Modal visible={show} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalBody}>
                    <Text style={styles.title}>{t('players.enterPlayerName')}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setPlayerName(text)}
                        value={playerName}
                        placeholder={t('players.playerName')}
                    />
                    <Pressable style={[styles.button, {backgroundColor: '#4A90E2'}]} onPress={handleScanNfc}>
                        <MaterialCommunityIcons name="nfc" size={24} color="white" style={{marginRight:5}} />
                        <Text style={styles.buttonText}>{t('players.scanNfc')}</Text>
                    </Pressable>

                    {nfcError ? (
                        <Text style={[styles.buttonText, {color: "red"}]}>{nfcError}</Text>
                    ) : nfcData !== '' ? (
                        <Text style={[styles.buttonText, {color: "green"}]}>{t('players.cardScanned')}</Text>
                    ) : null}

                    <View style={styles.innerButtons}>
                        <Pressable style={styles.button} onPress={reset}>
                            <Text style={styles.buttonText}>{t('common.cancel')}</Text>
                        </Pressable>
                        {editing &&
                            <Pressable style={styles.button} onPress={handleDelete}>
                                <MaterialIcons name="delete" size={24} color="white" />
                                <Text style={styles.buttonText}>{t('common.delete')}</Text>
                            </Pressable>
                        }
                        {playerName.length >= 1 && nfcData !== '' && !nfcError &&
                            <Pressable style={styles.button} onPress={handleOk}>
                                <Text style={styles.buttonText}>
                                    {editing ? t('players.modify') : t('common.add')}
                                </Text>
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