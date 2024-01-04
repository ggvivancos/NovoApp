import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface CabecalhoEtapaProps {
    etapaAtual: number;
    totalEtapas: number;
    irParaEtapaAnterior: () => void;
    irParaProximaEtapa: () => void;
}

const CabecalhoEtapa: React.FC<CabecalhoEtapaProps> = ({
    etapaAtual,
    totalEtapas,
    irParaEtapaAnterior,
    irParaProximaEtapa
}) => {
    const isAnteriorDisabled = etapaAtual === 1;
    const isProximoDisabled = etapaAtual === totalEtapas;

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[styles.botao, isAnteriorDisabled && styles.botaoDesativado]} 
                onPress={irParaEtapaAnterior}
                disabled={isAnteriorDisabled}
            >
                <Icon name="angle-left" size={44} color={isAnteriorDisabled ? 'grey' : 'black'} />
                <Text style={styles.textoBotao}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.titulo}>Agendamento - Etapa {etapaAtual}</Text>

            <TouchableOpacity 
                style={[styles.botao, isProximoDisabled && styles.botaoDesativado]} 
                onPress={irParaProximaEtapa}
                disabled={isProximoDisabled}
            >
                <Icon name="angle-right" size={44} color={isProximoDisabled ? 'grey' : 'black'} />
                <Text style={styles.textoBotao}>Próximo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    botao: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: 70,
        height: 60,
    },
    botaoDesativado: {
        opacity: 0.5,
    },
    textoBotao: {
        fontSize: 12,
        color: 'black',
        marginTop: 5,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default CabecalhoEtapa;
