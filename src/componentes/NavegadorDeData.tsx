import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

interface NavegadorDeDataProps {
    dataAtual: Date;
    onMudancaData: (data: Date) => void;
}

const NavegadorDeData: React.FC<NavegadorDeDataProps> = ({ dataAtual, onMudancaData }) => {

    function adicionarDias(data: Date, dias: number) {
        let novaData = new Date(data.valueOf());
        novaData.setDate(novaData.getDate() + dias);
        return novaData;
    }

    function irParaDiaAnterior() {
        onMudancaData(adicionarDias(dataAtual, -1));
    }

    function irParaDiaSeguinte() {
        onMudancaData(adicionarDias(dataAtual, 1));
    }

    function formatarDataParaPtBR(data: Date) {
        const diasDaSemana = ["Domingo", "Segunda-feira", "Terça=feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const diaSemana = diasDaSemana[data.getDay()];
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${diaSemana},    ${dia}/${mes}/${ano}`;
    }

    return (
        <View style={styles.container}>
            <Button title="Dia Anterior" onPress={irParaDiaAnterior} />
            <Text style={styles.textoData}>{formatarDataParaPtBR(dataAtual)}</Text>
            <Button title="Dia Seguinte" onPress={irParaDiaSeguinte} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    textoData: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    }
});

export default NavegadorDeData;
