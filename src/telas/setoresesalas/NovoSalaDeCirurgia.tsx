import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as SalaDeCirurgiaService from '../../services/SalaDeCirurgiaService';

type RouteParams = {
    salaId?: string;
    setorId?: string;
}

const NovoSalaDeCirurgia = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const salaId = params?.salaId;
    const { setorId } = route.params as RouteParams;
    const [nome, setNome] = useState('');
    const [nomeAbreviado, setNomeAbreviado] = useState('');

    useEffect(() => {
        console.log("Sala ID recebido:", salaId);
        if (salaId) {
            SalaDeCirurgiaService.obterSalaDeCirurgiaPorId(salaId)
                .then((sala: any) => {
                    setNome(sala.nome);
                    setNomeAbreviado(sala.nomeabreviado);
                })
                .catch(err => console.error("Erro ao buscar sala de cirurgia:", err));
        }
    }, [salaId]);

    const salvar = () => {
        if (!nome) {
            Alert.alert('Erro', 'Por favor, preencha o nome.');
            return;
        }

        const salaData = {
            nome: nome,
            nomeabreviado: nomeAbreviado,
            setorId: setorId
        };

        if (salaId) {
            SalaDeCirurgiaService.atualizarSalaDeCirurgia(Number(salaId), salaData)
                .then(response => {
                    Alert.alert('Sucesso', 'Sala de cirurgia atualizada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar sala de cirurgia:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            SalaDeCirurgiaService.criarSalaDeCirurgia(salaData)
                .then(response => {
                    Alert.alert('Sucesso', 'Sala de cirurgia criada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar sala de cirurgia:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {salaId ? 'Editar Sala de Cirurgia' : 'Nova Sala de Cirurgia'}
                    </Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Nome Abreviado</Text>
                    <TextInput
                        value={nomeAbreviado}
                        onChangeText={setNomeAbreviado}
                        placeholder="Digite o nome abreviado (opcional)"
                        style={styles.input}
                    />

                    <View style={styles.buttonContainer}>
                        <AppButton title="Salvar" onPress={salvar} />
                        <AppButton title="Cancelar" onPress={() => navigation.goBack()} />
                    </View>
                </View>
            </ScrollView>
        </GlobalLayout>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    scrollView: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
    },
    hospitalName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
    },
});


export default NovoSalaDeCirurgia;
