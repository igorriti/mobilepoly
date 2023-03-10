import { View, Text, Modal, StyleSheet,Animated,Easing } from 'react-native'
import React, {useState,useEffect} from 'react'

export default function BottomPopUp({show=false,setShow}) {
    const [dot1Opacity, setDot1Opacity] = useState(new Animated.Value(0));
    const [dot2Opacity, setDot2Opacity] = useState(new Animated.Value(0));
    const [dot3Opacity, setDot3Opacity] = useState(new Animated.Value(0));

    const close = () => {
        setShow(false)
    }


    useEffect(() => {
      const animateDots = () => {
        Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),

          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Opacity, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])).start(() => animateDots());
      };
  
      if (show) {
        animateDots();
      }
    }, [show]);


    return (
        <Modal 
        animationType={"fade"}
        transparent={true}
        visible={show}
        onRequestClose={() => {close}}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.innerTitle}>
                      <Text style={styles.title}>
                        Escaneando
                      </Text>
                      <Animated.Text style={[styles.title, { opacity: dot1Opacity }]}>
                        .
                      </Animated.Text>
                      <Animated.Text style={[styles.title, { opacity: dot2Opacity }]}>
                        .
                      </Animated.Text>
                      <Animated.Text style={[styles.title, { opacity: dot3Opacity }]}>
                        .
                      </Animated.Text>
                    </View>
                    
                    <Text style={styles.description}>Acerque la tarjeta NFC</Text>
                </View>
            </View>
        </Modal>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    content: {
      backgroundColor: 'white',
      padding: 24,
      borderRadius: 4,
    },
    innerTitle: {
      display: 'flex',  
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: 'gray',
    },
  });