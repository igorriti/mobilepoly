import { View, Text, Modal, StyleSheet, Animated, Easing, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';

export default function BottomPopUp({show=false, setShow, isIsoDepMessage=false}) {
    const { t } = useTranslation();
    const [dot1Opacity, setDot1Opacity] = useState(new Animated.Value(0));
    const [dot2Opacity, setDot2Opacity] = useState(new Animated.Value(0));
    const [dot3Opacity, setDot3Opacity] = useState(new Animated.Value(0));
    const [message, setMessage] = useState('');

    const close = () => {
        setShow(false);
    }

    useEffect(() => {
        setMessage(isIsoDepMessage ? t('players.scanAgain') : t('nfc.approachCard'));
    }, [isIsoDepMessage, t]);

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
                ])
            ).start(() => animateDots());
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
            onRequestClose={close}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Pressable style={styles.closeButton} onPress={close}>
                        <AntDesign name="close" size={24} color="black" />
                    </Pressable>
                    <View style={styles.innerTitle}>
                        <Text style={styles.title}>
                            {t('nfc.scanning')}
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
                    
                    <Text style={styles.description}>
                        {message}
                    </Text>
                </View>
            </View>
        </Modal>
    );
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
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    },
    innerTitle: {
        display: 'flex',  
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
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