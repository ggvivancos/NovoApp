// AcoesBotoesPretos.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AcoesBotoesPretosProps {
    onEditarPress?: () => void;
    onDeletarPress?: () => void;
}

const AcoesBotoesPretos: React.FC<AcoesBotoesPretosProps> = ({ onEditarPress, onDeletarPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.editarBotao} onPress={onEditarPress}>
                <Icon name="pencil" size={18} color="#3C3C3C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deletarBotao} onPress={onDeletarPress}>
                <Icon name="trash" size={18} color="#3C3C3C" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    editarBotao: {
        marginRight: 15,  // Reduzido para ser discretamente menor
    },
    deletarBotao: {
        marginRight: 4,  // Reduzido para ser discretamente menor
    },
});

export default AcoesBotoesPretos;
