import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
}

const AppButton: React.FC<AppButtonProps> = ({ title, style, ...props }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} {...props}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#89D5B8',
        borderRadius: 25,
        height: 40,
        width: 120,
        margin: 10,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold'
    }
});

export default AppButton;
