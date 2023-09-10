import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Importação do componente Icon

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
                    <View style={styles.iconContainer}>
                        <Icon 
                            name="pencil" 
                            size={20} 
                            color="skyblue" 
                            onPress={() => {
                                // TODO: Implementar a função de edição
                            }} 
                            style={styles.icon}
                        />
                        <Icon 
                            name="close" 
                            size={20} 
                            color="skyblue" 
                            onPress={onRequestClose} 
                            style={styles.icon}
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Data:</Text>
                        <Text style={styles.value}>{data.toLocaleDateString('pt-BR')}</Text>
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
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',  // Branco quase transparente
    },
    content: {
        width: 400, 
        padding: 20, 
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: '#d1d1d1',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    icon: {
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
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
