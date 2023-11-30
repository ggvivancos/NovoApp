import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as EspecialidadeService from '../../services/EspecialidadeService';
import PaletaDeCores from '../../componentes/utilities/PaletaDeCores'; // Importe o componente PaletaDeCores

type RouteParams = {
    especialidadeId?: string;
}

const NovoEspecialidade = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const especialidadeId = params?.especialidadeId;

    const [nome, setNome] = useState('');
    const [nomeAbreviado, setNomeAbreviado] = useState('');
    const [cor, setCor] = useState(''); // Adicionando estado para a cor

    useEffect(() => {
        if (especialidadeId) {
            EspecialidadeService.obterEspecialidadePorId(especialidadeId)
                .then((especialidade: any) => {
                    setNome(especialidade.nome);
                    setNomeAbreviado(especialidade.nomeabreviado);
                    setCor(especialidade.cor); // Definindo a cor da especialidade
                })
                .catch(err => console.error("Erro ao buscar especialidade:", err));
        }
    }, [especialidadeId]);

    const salvar = () => {
        if (!nome || !nomeAbreviado || !cor) { // Verificando se a cor foi definida
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const especialidadeData = {
            nome: nome,
            nomeabreviado: nomeAbreviado,
            cor: cor // Incluindo a cor no objeto de dados
        };

        // ...continuação do método salvar
        if (especialidadeId) {
            EspecialidadeService.atualizarEspecialidade(Number(especialidadeId), especialidadeData)
                .then(response => {
                    Alert.alert('Sucesso', 'Especialidade atualizada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar especialidade:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            EspecialidadeService.criarEspecialidade(especialidadeData)
                .then(response => {
                    Alert.alert('Sucesso', 'Especialidade criada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar especialidade:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {especialidadeId ? 'Editar Especialidade' : 'Nova Especialidade'}
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

export default NovoEspecialidade;

