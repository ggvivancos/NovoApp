import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import CabeçalhoAnestesistas from './CabeçalhoAnestesistas';
import GlobalLayout from '../../../layouts/GlobalLayout';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabeçalhoGlobal from '../../../componentes/CabeçalhoGlobal';

const data = [
    { id: 1, nomecompleto: 'Caio Silva', nomeabreviado: 'Caio', iniciais: 'CS', grupodeanestesia: 'Grupo A' },
    { id: 2, nomecompleto: 'Lucas Oliveira', nomeabreviado: 'Lucas', iniciais: 'LO', grupodeanestesia: 'Grupo B' },
    { id: 3, nomecompleto: 'Mariana Ferreira', nomeabreviado: 'Mari', iniciais: 'MF', grupodeanestesia: 'Grupo C' },
    { id: 4, nomecompleto: 'Felipe Dias', nomeabreviado: 'Felipe', iniciais: 'FD', grupodeanestesia: 'Grupo A' },
    { id: 5, nomecompleto: 'Beatriz Alves', nomeabreviado: 'Bia', iniciais: 'BA', grupodeanestesia: 'Grupo D' },
    { id: 6, nomecompleto: 'Guilherme Costa', nomeabreviado: 'Gui', iniciais: 'GC', grupodeanestesia: 'Grupo A' },
    { id: 7, nomecompleto: 'Juliana Martins', nomeabreviado: 'Juh', iniciais: 'JM', grupodeanestesia: 'Grupo E' },
    { id: 8, nomecompleto: 'Roberto Siqueira', nomeabreviado: 'Robert', iniciais: 'RS', grupodeanestesia: 'Grupo F' },
    { id: 9, nomecompleto: 'Carolina Prado', nomeabreviado: 'Carol', iniciais: 'CP', grupodeanestesia: 'Grupo B' },
    { id: 10, nomecompleto: 'André Santos', nomeabreviado: 'André', iniciais: 'AS', grupodeanestesia: 'Grupo C' },
    { id: 11, nomecompleto: 'Tatiana Moraes', nomeabreviado: 'Tati', iniciais: 'TM', grupodeanestesia: 'Grupo D' },
];

const TelaAnestesistas = () => {

    const handleMenuPress = () => {
        console.log("Menu pressionado em TelaAnestesistas!");
        // Aqui você pode definir o que acontece quando o botão do menu é pressionado
    };

    return (
        <GlobalLayout 
        headerComponent={
            <>
                <CabeçalhoGlobal 
                    onMenuPress={handleMenuPress} 
                    title="ANESTESISTAS"
                />
                <CabeçalhoAnestesistas style={styles.cabecalhoPadding} />
            </>
        }
    >
            <ScrollView>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={styles.cellNomeCompleto}><Text style={styles.headerText}>Nome</Text></View>
                        <View style={styles.cellNomeAbreviadoGrupo}><Text style={styles.headerText}>Abreviado</Text></View>
                        <View style={styles.cellIniciaisAcoes}><Text style={styles.headerText}>Iniciais</Text></View>
                        <View style={styles.cellNomeAbreviadoGrupo}><Text style={styles.headerText}>Grupo</Text></View>
                        <View style={styles.cellAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>
                    {data.map(anestesista => (
                        <View key={anestesista.id} style={styles.row}>
                            <View style={styles.cellNomeCompleto}><Text>{anestesista.nomecompleto}</Text></View>
                            <View style={styles.cellNomeAbreviadoGrupo}><Text>{anestesista.nomeabreviado}</Text></View>
                            <View style={styles.cellIniciaisAcoes}><Text>{anestesista.iniciais}</Text></View>
                            <View style={styles.cellNomeAbreviadoGrupo}><Text>{anestesista.grupodeanestesia}</Text></View>
                            <View style={[styles.cellAcoes, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                <TouchableOpacity style={{ marginRight: 10 }}>
                                    <Icon name="pencil" size={24} color="skyblue" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon name="trash" size={24} color="#ff6666" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </GlobalLayout>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cabecalhoPadding: {
        paddingLeft: 50, // Ajuste esse valor conforme necessário
    },
    table: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    headerText: {
        fontWeight: 'bold',
    },
    cellNomeCompleto: {
        width: 150,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellNomeAbreviadoGrupo: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellIniciaisAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 1,
    },
});

export default TelaAnestesistas;




