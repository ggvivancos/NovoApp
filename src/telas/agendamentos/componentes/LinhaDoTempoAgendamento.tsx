import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScaledSize } from 'react-native';

interface LinhaDoTempoAgendamentoProps {
    etapaAtual: number;
}

const LinhaDoTempoAgendamento: React.FC<LinhaDoTempoAgendamentoProps> = ({ etapaAtual }) => {
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        const onChange = ({ window }: { window: ScaledSize }) => {
            setScreenWidth(window.width);
        };

        // Adiciona o ouvinte e retorna a função de limpeza
        const subscription = Dimensions.addEventListener('change', onChange);
        return () => subscription.remove();
    }, []);

  
    const etapas = [1, 2, 3, 4, 5]; // Total de etapas

    return (
        <View style={styles.linhaDoTempoContainer}>
            {etapas.map((etapa, index) => {
                const isEtapaAtual = etapa === etapaAtual;
                const bolinhaSize = isEtapaAtual ? 35 : 25;
                const bolinhaRadius = bolinhaSize / 2;
                const linhaWidth = ((screenWidth * 0.9) - (etapas.length * bolinhaSize)) / (etapas.length - 1) - 10; // 10 for margin

                return (
                    <View key={index} style={styles.bolinhaContainer}>
                        <View style={[
                            styles.bolinha,
                            { width: bolinhaSize, height: bolinhaSize, borderRadius: bolinhaRadius },
                            isEtapaAtual ? styles.bolinhaAtiva : styles.bolinhaInativa
                        ]}>
                            <Text style={[
                                styles.textoBolinha,
                                isEtapaAtual ? { fontSize: 18 } : {}
                            ]}>
                                {etapa}
                            </Text>
                        </View>
                        {index < etapas.length - 1 && (
                            <View style={[styles.linhaHorizontal, { width: linhaWidth }]} />
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    linhaDoTempoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingRigth: 30,
    },
    bolinhaContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bolinha: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bolinhaAtiva: {
        backgroundColor: 'black',
    },
    bolinhaInativa: {
        backgroundColor: 'darkgrey',
    },
    textoBolinha: {
        color: 'white',
        fontWeight: 'bold',
    },
    linhaHorizontal: {
        height: 2,
        backgroundColor: 'darkgrey',
        marginHorizontal: 5,
    },
});

export default LinhaDoTempoAgendamento;
