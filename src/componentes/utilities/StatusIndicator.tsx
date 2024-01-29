import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusData } from '../../types'; // Ajuste o caminho conforme necessário
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';


const StatusIndicator: React.FC<StatusData> = ({ nome, cor }) => {
 
    
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.2, {
                duration: 1000,
                easing: Easing.inOut(Easing.ease)
            }),
            -1, // Repetir infinitamente
            true // Reverter a animação
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.indicator, { backgroundColor: cor }, animatedStyle]} />
            <Text style={styles.text}>{nome}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    indicator: {
        height: 15,
        width: 15,
        borderRadius: 7.5,
        marginBottom: 5
    },
    text: {
        fontSize: 11 
    }
});

export default StatusIndicator;
