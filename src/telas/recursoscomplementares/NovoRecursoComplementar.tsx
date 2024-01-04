import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as RecursoComplementarService from '../../services/RecursoComplementarService';
import Icon from 'react-native-vector-icons/FontAwesome';

type RouteParams = {
    recursoId?: string;
}

const NovoRecursoComplementar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const recursoId = params?.recursoId;

    const [recurso, setRecurso] = useState('');
    const [descricao, setDescricao] = useState('');
    const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);

    useEffect(() => {
        if (recursoId) {
            RecursoComplementarService.obterRecursoComplementarPorId(recursoId)
                .then((recursoComplementar: any) => {
                    setRecurso(recursoComplementar.recurso);
                    setDescricao(recursoComplementar.descricao);
                    setQuantidadeDisponivel(recursoComplementar.quantidadeDisponivel);
                })
                .catch(err => console.error("Erro ao buscar recurso complementar:", err));
        }
    }, [recursoId]);

    const incrementarQuantidade = () => {
        setQuantidadeDisponivel(quantidadeDisponivel + 1);
    };

    const decrementarQuantidade = () => {
        if (quantidadeDisponivel > 0) {
            setQuantidadeDisponivel(quantidadeDisponivel - 1);
        }
    };

    const salvar = () => {
        if (!recurso || quantidadeDisponivel <= 0) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const recursoComplementarData = {
            recurso: recurso,
            descricao: descricao,
            quantidadeDisponivel: quantidadeDisponivel
        };

        if (recursoId) {
            RecursoComplementarService.atualizarRecursoComplementar(Number(recursoId), recursoComplementarData)
                .then(response => {
                    Alert.alert('Sucesso', 'Recurso complementar atualizado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar recurso complementar:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            RecursoComplementarService.criarRecursoComplementar(recursoComplementarData)
                .then(response => {
                    Alert.alert('Sucesso', 'Recurso complementar criado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar recurso complementar:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {recursoId ? 'Editar Recurso Complementar' : 'Novo Recurso Complementar'}
                    </Text>

                    <Text style={styles.label}>Recurso</Text>
                    <TextInput
                        value={recurso}
                        onChangeText={setRecurso}
                        placeholder="Digite o nome do recurso"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Digite a descrição"
                        style={styles.input}
                        multiline
                    />

                    <Text style={styles.label}>Quantidade Disponível</Text>
                    <View style={styles.quantidadeContainer}>
                        <TouchableOpacity onPress={decrementarQuantidade} style={styles.quantidadeBotao}>
                            <Icon name="minus" size={20} color="#333" />
                        </TouchableOpacity>
                        <TextInput
                            value={quantidadeDisponivel.toString()}
                            onChangeText={(text) => setQuantidadeDisponivel(Number(text))}
                            placeholder="0"
                            style={styles.quantidadeInput}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={incrementarQuantidade} style={styles.quantidadeBotao}>
                            <Icon name="plus" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>

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
    quantidadeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    quantidadeInput: {
        flex: 1,
        textAlign: 'center',
        padding: 10,
    },
    quantidadeBotao: {
        padding: 10,
    },
});

export default NovoRecursoComplementar;
