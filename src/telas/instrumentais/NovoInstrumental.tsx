import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as InstrumentalService from '../../services/InstrumentalService'; // Alterado
import Icon from 'react-native-vector-icons/FontAwesome';

type RouteParams = {
    instrumentalId?: string; // Alterado
}

const NovoInstrumental = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const instrumentalId = params?.instrumentalId; // Alterado

    const [nome, setNome] = useState(''); // Alterado
    const [descricao, setDescricao] = useState('');
    const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);

    useEffect(() => {
        if (instrumentalId) { // Alterado
            InstrumentalService.obterInstrumentalPorId(instrumentalId) // Alterado
                .then((instrumental: any) => { // Alterado
                    setNome(instrumental.nome); // Alterado
                    setDescricao(instrumental.descricao);
                    setQuantidadeDisponivel(instrumental.quantidadeDisponivel);
                })
                .catch(err => console.error("Erro ao buscar instrumental:", err)); // Alterado
        }
    }, [instrumentalId]); // Alterado

    const incrementarQuantidade = () => {
        setQuantidadeDisponivel(quantidadeDisponivel + 1);
    };

    const decrementarQuantidade = () => {
        if (quantidadeDisponivel > 0) {
            setQuantidadeDisponivel(quantidadeDisponivel - 1);
        }
    };

    const salvar = () => {
        if (!nome || quantidadeDisponivel <= 0) { // Alterado
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const instrumentalData = { // Alterado
            nome: nome, // Alterado
            descricao: descricao,
            quantidadeDisponivel: quantidadeDisponivel
        };

        if (instrumentalId) { // Alterado
            InstrumentalService.atualizarInstrumental(Number(instrumentalId), instrumentalData) // Alterado
                .then(response => {
                    Alert.alert('Sucesso', 'Instrumental atualizado com sucesso!'); // Alterado
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar instrumental:', error); // Alterado
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.'); // Alterado
                });
        } else {
            InstrumentalService.criarInstrumental(instrumentalData) // Alterado
                .then(response => {
                    Alert.alert('Sucesso', 'Instrumental criado com sucesso!'); // Alterado
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar instrumental:', error); // Alterado
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.'); // Alterado
                });
        }
    };

        // Continuação do componente NovoInstrumental
        return (
            <GlobalLayout showBackButton={true}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <Text style={styles.title}>
                            {instrumentalId ? 'Editar Instrumental' : 'Novo Instrumental'}
                        </Text>
    
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Digite o nome do instrumental"
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
    
    
    export default NovoInstrumental;
    
