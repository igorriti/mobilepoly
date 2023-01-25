import React, { useEffect } from 'react'
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

export default function PlayerSelector({show=false,setShow,bankruptcy,name,value,pay, error}) {

    return (
        <Modal animationType='fade' transparent={true} visible={show} >
            <View style={styles.container}>
                <View style={styles.modalBody}>
                    {error ? 
                        <AntDesign name="closecircle" size={50} color="red" />
                    :
                        <AntDesign name="checkcircle" size={50} color="green" />

                    }
                    <Text style={styles.title}> {error? "Error en el pago" : pay? "Pago exitoso" : "Deposito exitoso!"}</Text>
                    <Text style={styles.description}>{error? "No tiene suficiente dinero para pagar" : `${name} ha recibido $${value}` }</Text>
                    {
                        error&&
                        <View style={{ marginTop: 30, flexDirection:'row', justifyContent:'space-between', alignItems: "center", width:'100%', paddingHorizontal:20}}>
                        <Pressable style={styles.bankruptcy} onPress={() => bankruptcy()}>
                            <Text style={styles.buttonText}>Declarar bancarrota</Text>
                        </Pressable>
                        <Pressable style={styles.closeButton} onPress={() => setShow(false)}>
                            <Text style={[styles.buttonText, {color : 'red'}]}>Cerrar</Text>
                        </Pressable>
                        </View>
                    }

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
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom:10

    },
    description: {
        paddingTop : 10,
        fontSize: 15,

        borderTopColor: 'rgba(155,155,155,0.3)', borderTopWidth: 1,
    },

    buttonText: {
        color: '#4A90E2',
        fontSize: 15,
    },


  });