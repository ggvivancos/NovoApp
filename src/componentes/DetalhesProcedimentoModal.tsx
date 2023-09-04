import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface DetalhesProcedimentoModalProps {
    visible: boolean;
    onRequestClose: () => void;
    data: Date;
    horaInicio: string;
    duracao: number;
    hospital: string;
    cirurgiao: string;
    procedimento: string;
}

const DetalhesProcedimentoModal: React.FC<DetalhesProcedimentoModalProps> = ({
    visible,
    onRequestClose,
    data,
    horaInicio,
    duracao,
    hospital,
    cirurgiao,
    procedimento,
}) => {
    const previsao = (): string => {
        const [hours, minutes] = horaInicio.split(":").map(Number);
        const endDate = new Date(data);
        endDate.setHours(hours + duracao, minutes);
        return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
           <View style={styles.container}>
    <View style={styles.content}>
        
        <View style={styles.row}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{data.toLocaleDateString()}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Hora de Início:</Text>
            <Text style={styles.value}>{horaInicio}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Duração Prevista:</Text>
            <Text style={styles.value}>{duracao} horas</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Hospital:</Text>
            <Text style={styles.value}>{hospital}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Cirurgião:</Text>
            <Text style={styles.value}>{cirurgiao}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Procedimento:</Text>
            <Text style={styles.value}>{procedimento}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Previsão de Término:</Text>
            <Text style={styles.value}>{previsao()}</Text>
        </View>
        <Button title="Fechar" onPress={onRequestClose} />

        </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    content: {
        width: 400, 
        padding: 20, 
        backgroundColor: 'white', 
        borderRadius: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',  // Alinhar verticalmente no centro
        marginBottom: 5,      // Espaço vertical entre as linhas
    },
    label: {
        fontSize: 14,
        marginRight: 10,
        marginVertical: 5
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 5
    },
   
});

export default DetalhesProcedimentoModal;
