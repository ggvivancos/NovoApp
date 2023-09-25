// AcoesBotoes.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AcoesBotoesProps {
    onEditarPress?: () => void;
    onDeletarPress?: () => void;
}

const AcoesBotoes: React.FC<AcoesBotoesProps> = ({ onEditarPress, onDeletarPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.editarBotao} onPress={onEditarPress}>
                <Icon name="pencil" size={22} color="skyblue" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deletarBotao} onPress={onDeletarPress}>
                <Icon name="trash" size={22} color="#ff6666" />
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
        marginRight: 10,
    },
    deletarBotao: {
        marginRight: -10,
    },
});

export default AcoesBotoes;
