import { View, Text,StyleSheet, Image } from 'react-native'
import React from 'react'
import Animation from './Animation';

export default function Background(props) {
  return (
    <View style={styles.container}>
        <Animation />
        {props.children} 


    </View>

  )

  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

  });