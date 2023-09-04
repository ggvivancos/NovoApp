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

    return (
        <View style={styles.container}>
            <Button title="Dia Anterior" onPress={irParaDiaAnterior} />
            <Text>{dataAtual.toDateString()}</Text>
            <Button title="Dia Seguinte" onPress={irParaDiaSeguinte} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    }
});

export default NavegadorDeData;
