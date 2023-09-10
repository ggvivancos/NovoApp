import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface CabeçalhoGlobalProps {
    onMenuPress: () => void;
    title: string;
}

const CabeçalhoGlobal: React.FC<CabeçalhoGlobalProps> = ({ onMenuPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onMenuPress}>
                <Icon name="bars" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50,  // Defina a largura desejada do menu hambúrguer aqui
        height: 50, // Defina a altura desejada do menu hambúrguer aqui
        backgroundColor: 'skyblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CabeçalhoGlobal;
