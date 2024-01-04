import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import Etapa2Agendamento from './Etapa2Agendamento';
import Etapa1Agendamento from './Etapa1Agendamento';
import Etapa3Agendamento from './Etapa3Agendamento';
import Etapa4Agendamento from './Etapa4Agendamento';
import Etapa5Agendamento from './Etapa5Agendamento';
import LinhaDoTempoAgendamento from './componentes/LinhaDoTempoAgendamento';
import CabeçalhoEtapa from './componentes/CabecalhoEtapa'; // Certifique-se de importar o componente CabeçalhoEtapa

const NovoAgendamento = () => {
    const [etapaAtual, setEtapaAtual] = useState(1);
    const totalEtapas = 5;

    const irParaProximaEtapa = () => {
        if (etapaAtual < totalEtapas) {
            setEtapaAtual(etapaAtual + 1);
        }
    };

    const irParaEtapaAnterior = () => {
        if (etapaAtual > 1) {
            setEtapaAtual(etapaAtual - 1);
        }
    };

    const renderizarEtapa = () => {
        switch (etapaAtual) {
            case 1:
                return <Etapa1Agendamento irParaProximaEtapa={irParaProximaEtapa} />;
            case 2:
                return <Etapa2Agendamento irParaProximaEtapa={irParaProximaEtapa} irParaEtapaAnterior={irParaEtapaAnterior} />;
            case 3:
                return <Etapa3Agendamento irParaProximaEtapa={irParaProximaEtapa} irParaEtapaAnterior={irParaEtapaAnterior} />;
            case 4:
                return <Etapa4Agendamento irParaProximaEtapa={irParaProximaEtapa} irParaEtapaAnterior={irParaEtapaAnterior} />;
            case 5:
                return <Etapa5Agendamento irParaEtapaAnterior={irParaEtapaAnterior} />;
            default:
                return <Text>Etapa desconhecida</Text>;
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <LinhaDoTempoAgendamento etapaAtual={etapaAtual} />
                <CabeçalhoEtapa 
                    etapaAtual={etapaAtual} 
                    totalEtapas={totalEtapas} 
                    irParaEtapaAnterior={irParaEtapaAnterior} 
                    irParaProximaEtapa={irParaProximaEtapa} 
                />
                <View style={styles.container}>
                    {renderizarEtapa()}
                </View>
            </ScrollView>
        </GlobalLayout>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    // Estilos adicionais conforme necessário
});

export default NovoAgendamento;
