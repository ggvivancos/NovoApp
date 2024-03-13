import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as FioService from '../../services/FioService'; // Certifique-se de ajustar para seu serviço de Fios
import Icon from 'react-native-vector-icons/FontAwesome';

type RouteParams = {
    fioId?: string;
}

const NovoFio = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const fioId = params?.fioId;

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        if (fioId) {
            FioService.obterFioPorId(fioId) // Ajuste para o seu método de serviço
                .then((fio: any) => {
                    setNome(fio.nome);
                    setDescricao(fio.descricao);
                })
                .catch(err => console.error("Erro ao buscar fio:", err));
        }
    }, [fioId]);

    const salvar = () => {
        if (!nome) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const fioData = {
            nome: nome,
            descricao: descricao,
        };

        if (fioId) {
            FioService.atualizarFio(Number(fioId), fioData) // Ajuste para o seu método de serviço
                .then(response => {
                    Alert.alert('Sucesso', 'Fio atualizado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar fio:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            FioService.criarFio(fioData) // Ajuste para o seu método de serviço
                .then(response => {
                    Alert.alert('Sucesso', 'Fio criado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar fio:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {fioId ? 'Editar Fio' : 'Novo Fio'}
                    </Text>

                    <Text style={styles.label}>Nome do Fio</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome do fio"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Marca do Fio</Text>
                    <TextInput
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Digite a marca do Fio"
                        style={styles.input}
                        multiline
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
    // Estilos permanecem inalterados do componente original
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
    // Removido o estilo de quantidadeContainer, quantidadeInput e quantidadeBotao, pois não são mais necessários
});

export default NovoFio;
