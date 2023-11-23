import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as ProcedimentoService from '../../services/ProcedimentoService';

type RouteParams = {
    procedimentoId?: string;
}

const NovoProcedimento = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const procedimentoId = params?.procedimentoId;

    const [nome, setNome] = useState('');
    const [codigoTUSS, setCodigoTUSS] = useState('');
    const [nomeabreviado, setNomeAbreviado] = useState('');

    useEffect(() => {
        if (procedimentoId) {
            ProcedimentoService.obterProcedimentoPorId(procedimentoId)
                .then((procedimento: any) => {
                    setNome(procedimento.nome);
                    setCodigoTUSS(procedimento.codigoTUSS);
                    setNomeAbreviado(procedimento.nomeAbreviado);
                })
                .catch(err => console.error("Erro ao buscar procedimento:", err));
        }
    }, [procedimentoId]);

    const salvar = () => {
        if (!nome || !codigoTUSS || !nomeabreviado) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const procedimentoData = {
            nome: nome,
            codigoTUSS: codigoTUSS,
            nomeabreviado: nomeabreviado,
        };

        if (procedimentoId) {
            ProcedimentoService.atualizarProcedimento(Number(procedimentoId), procedimentoData)
                .then(response => {
                    Alert.alert('Sucesso', 'Procedimento atualizado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar procedimento:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            ProcedimentoService.criarProcedimento(procedimentoData)
                .then(response => {
                    Alert.alert('Sucesso', 'Procedimento criado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar procedimento:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {procedimentoId ? 'Editar Procedimento' : 'Novo Procedimento'}
                    </Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome do procedimento"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Código TUSS</Text>
                    <TextInput
                        value={codigoTUSS}
                        onChangeText={setCodigoTUSS}
                        placeholder="Digite o código TUSS"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Nome Abreviado</Text>
                    <TextInput
                        value={nomeabreviado}
                        onChangeText={setNomeAbreviado}
                        placeholder="Digite o nome abreviado"
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
});

export default NovoProcedimento;
