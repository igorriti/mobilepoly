import React, { useState } from 'react';
import {  FlatList, Pressable, StyleSheet, Text, TextInput, View, Modal, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'; 
import bgMono from '../assets/bgMono.png';
import PlayerAdder from '../components/PlayerAdder';


export default function PlayersConfig({navigation}) {
    const [players, setPlayers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [index, setIndex] = useState(0);
    const [nfcData, setNfcData] = useState('');

    const reset = () => {
        setModalVisible(false);
        setPlayerName('');
        setNfcData('');
        setEditing(false);
    }


    const handleEdit = () => {
        setEditing(true);
        setModalVisible(true);

    }

    const handleAddPlayer = () => {
        setModalVisible(true);
    };



    const handleStartPress = async () =>{
        try{
            await AsyncStorage.setItem('game', JSON.stringify({players}));
            navigation.navigate('BankMenu');
        }catch(error){
            console.log(error);
        }
    }

    return (
        <>  
            <View style={styles.container}>
                <Pressable style={styles.backButton} onPress={() => {navigation.navigate("Home")}}>
                    <Ionicons name="md-chevron-back-outline" size={24} color="white" />
                    <Text style={{color:"white", fontSize : 20}}> Volver al menu </Text>
                </Pressable>
                <ImageBackground  source={bgMono} resizeMode="cover" style={styles.backgroundImage}/>
                <Text style={styles.title}>Lista de jugadores</Text>
                <FlatList
                    style={styles.flatlist}
                    data={players}
                    renderItem={({ item,index }) => (
                        <View style={styles.flatListItem}>
                        <Text style={styles.flatListItemText}>Jugador: {item.name}</Text>

                        <Pressable style={styles.editButton} onPress={()=>{
                            setIndex(index);
                            setPlayerName(item.name);
                            setNfcData(item.nfcData);
                            handleEdit()}}>
                            <Feather name="edit-2" size={24} color="black" />
                        </Pressable>
                        </View>
                    )}
                />
                {players.length < 6 && (
                    <Pressable style={styles.button} onPress={handleAddPlayer}>
                        <AntDesign name="adduser" size={24} color="white" />
                        <Text style={styles.buttonText}>Agregar jugador</Text>
                    </Pressable>       
                )}

                {/* Player adder */}
                <PlayerAdder show={modalVisible} players={players} setPlayers={setPlayers} editing={editing} setEditing={setEditing} playerName={playerName} setPlayerName={setPlayerName} nfcData={nfcData} setNfcData={setNfcData} reset={reset} index={index} setIndex={setIndex} />

                {players.length >= 2 && (
                    <Pressable style={styles.button} onPress={handleStartPress}>
                        <Text style={styles.buttonText}>Comenzar juego</Text>
                    </Pressable>
                )}
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

    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        margin: 10,
        marginTop: 60,
    },

    button: {
        backgroundColor: '#C70000',
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
    editButton: {
        padding: 5,
        margin: 5,
        borderLeftColor: '#e8e8e8',
        borderLeftWidth: 1,
    },
    editButtonIcon: {
        color: 'white',
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

    flatListItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 5,
        padding: 10,
        width: 300,

      },
    flatListItemText: {
        fontSize: 20,
        padding: 5,
      },

});
  
  