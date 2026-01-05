import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function RumoLoadingScreen() {
    const fadeAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
         
            <StatusBar barStyle="dark-content" />
            
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Text style={styles.logoText}>RUMO</Text>
                <View style={styles.line} />
                <Text style={styles.subText}>빛을 밝히는 중</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#F0F5FA', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: '900',

        color: '#007AFF',
        letterSpacing: 15,
        textAlign: 'center',
    
        textShadowColor: 'rgba(0, 122, 255, 0.15)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    line: {
        width: 40,
        height: 3,
        backgroundColor: '#007AFF',
        borderRadius: 2,
        marginTop: 10,
        opacity: 0.3,
    },
    subText: {
        marginTop: 20,
        fontSize: 13,
        fontWeight: '600',
        color: '#A0B2C3', 
        letterSpacing: 2,
    }
});