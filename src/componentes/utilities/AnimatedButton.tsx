import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface AnimatedButtonProps {
    onPress?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    children: React.ReactNode;
    style?: ViewStyle;
}


const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onPress, children, style }) => {
    const opacity = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.timing(opacity, {
            toValue: 0.7,
            duration: 150,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true
        }).start();
    };

    return (
        <Animated.View
            style={[style, { opacity }]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handlePressIn}
            onResponderRelease={handlePressOut}
            onResponderTerminate={handlePressOut}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedButton;
