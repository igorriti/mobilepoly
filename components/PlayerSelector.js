import React, { useEffect } from 'react'
import { View, Text, Modal, StyleSheet, FlatList, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager,{ NfcTech } from 'react-native-nfc-manager';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function PlayerSelector({show,setShow,setPlayer,pay,players}) {
    const { t } = useTranslation();

    return (
        <Modal animationType='fade' transparent={true} visible={show}>
            <View style={styles.container}>
                <View style={styles.modalBody}>
                    <Text style={styles.title}>{pay ? t('bank.payTo') : t('bank.depositTo')}</Text>
                    <Pressable style={styles.closeButton} onPress={() => setShow(false)}>
                        <AntDesign name="close" size={24} color="black" />
                    </Pressable>
                    
                    <FlatList
                        style={styles.flatlist}
                        data={[{ name: t('common.bank'), nfcData: '1' },...players]}
                        renderItem={({ item }) => (
                            item.name === t('common.bank') ?
                                pay &&
                                    <Pressable style={styles.flatListItem} onPress={() => {setPlayer(item); setShow(false)}}>
                                        <FontAwesome name="bank" size={24} color="black" style={{marginRight: 10}} />
                                        <Text style={styles.flatListItemText}>{t('common.bank')}</Text>
                                    </Pressable>                                    
                            :
                                <Pressable style={styles.flatListItem} onPress={() => {setPlayer(item); setShow(false)}}>
                                    <FontAwesome name="user" size={24} color="black" style={{marginRight: 10}}/>
                                    <Text style={styles.flatListItemText}>{item.name}</Text>
                                </Pressable>                                    
                        )}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        backgroundColor: 'white',
        width: '80%',
        borderRadius: 20,
        paddingVertical: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: 10,
        left: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    flatListItem: {
        backgroundColor : '#e0e0e0',

        width: 200,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center', 
        borderRadius: 10,
      //   borderColor: 'gray',
    //   borderBottomWidth: 1,
    //   borderTopWidth: 1,
    },

    flatListItemText : {
        fontSize: 20,
    }
  });