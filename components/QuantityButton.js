import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

export default function QuantityButton({ value, onIncrement, onDecrement }) {

    return (
        <View style={styles.container}>
          <Pressable style={[styles.quantityButton, {borderRightWidth:2}]} onPress={onDecrement}>
            <Text style={[styles.quantityButtonText, value===2? {color: "#b2b2b2"} : null]}>-</Text>
          </Pressable>
          <Text style={[styles.quantityButtonText, {fontSize: 20}]}>{value}</Text>
          <Pressable style={[styles.quantityButton, {borderLeftWidth:2}]} onPress={onIncrement}>
            <Text style={[styles.quantityButtonText, value===6? {color: "#b2b2b2"} : null]}>+</Text>
          </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 130,
        marginTop: 50,
        borderRadius: 20,
        backgroundColor: "white"
      },
      quantityButton: {
        borderColor: '#e8e8e8',
        paddingVertical: 5,
        paddingHorizontal: 10
      },

      quantityButtonText: {
        
        color: '#000',
        fontSize: 25,
        fontWeight: 'bold',
        
      },
});