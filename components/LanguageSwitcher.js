import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Pressable 
            style={({pressed}) => [
                styles.container,
                {backgroundColor: pressed ? '#E10000' : '#C70000'}
            ]}
            onPress={toggleLanguage}
        >
            <Text style={styles.text}>
                {i18n.language === 'en' ? '🇦🇷 ES' : '🇺🇲 EN'}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40,
        right: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
}); 