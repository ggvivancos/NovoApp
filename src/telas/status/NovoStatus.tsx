import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as StatusService from '../../services/StatusService'; // Importe o StatusService
import PaletaDeCores from '../../componentes/utilities/PaletaDeCores';

type RouteParams = {
    statusId?: string;
}

const NovoStatus = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const statusId = params?.statusId;

    const [nome, setNome] = useState('');
    const [nomeabreviado, setNomeAbreviado] = useState(''); // Adicionado campo para nome abreviado
    const [cor, setCor] = useState('');

    useEffect(() => {
        if (statusId) {
            StatusService.obterStatusPorId(statusId) // Use o serviço StatusService
                .then((status: any) => {
                    setNome(status.nome);
                    setNomeAbreviado(status.nomeabreviado); // Adicionado campo para nome abreviado
                    setCor(status.cor);
                })
                .catch(err => console.error("Erro ao buscar status:", err));
        }
    }, [statusId]);

    const salvar = () => {
        if (!nome || !nomeabreviado || !cor) { // Verificação atualizada para incluir nomeAbreviado
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const statusData = {
            nome: nome,
            nomeabreviado: nomeabreviado, // Adicionado campo para nome abreviado
            cor: cor,
        };

        if (statusId) {
            StatusService.atualizarStatus(Number(statusId), statusData) // Use o serviço StatusService
                .then(response => {
                    Alert.alert('Sucesso', 'Status atualizado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar status:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            StatusService.criarStatus(statusData) // Use o serviço StatusService
                .then(response => {
                    Alert.alert('Sucesso', 'Status criado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar status:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {statusId ? 'Editar Status' : 'Novo Status'}
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
                        value={nomeabreviado}
                        onChangeText={setNomeAbreviado}
                        placeholder="Digite o nome abreviado"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Escolha uma cor da paleta:</Text>
                    <PaletaDeCores onColorSelect={setCor} />

                    <TextInput
                        value={cor}
                        onChangeText={setCor}
                        placeholder="Digite a cor (formato hexadecimal)"
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


export default NovoStatus;
