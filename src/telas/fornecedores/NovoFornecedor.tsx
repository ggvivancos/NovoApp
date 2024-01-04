import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as FornecedorService from '../../services/FornecedorService';

type RouteParams = {
    fornecedorId?: string;
}

const NovoFornecedor = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const fornecedorId = params?.fornecedorId;

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [representante, setRepresentante] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        if (fornecedorId) {
            FornecedorService.obterFornecedorPorId(fornecedorId)
                .then((fornecedor: any) => {
                    setNome(fornecedor.nome);
                    setTelefone(formatarTelefone(fornecedor.telefone));
                    setRepresentante(fornecedor.representante);
                    setDescricao(fornecedor.descricao);
                })
                .catch(err => console.error("Erro ao buscar fornecedor:", err));
        }
    }, [fornecedorId]);

    const formatarTelefone = (numero: string) => {
        const numeros = numero.replace(/\D/g, '');
        if (numeros.length <= 10) {
            // Formato (XX) XXXX-XXXX
            return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            // Formato (XX) XXXXX-XXXX
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    };

    const handleTelefoneChange = (text: string) => {
        const numeros = text.replace(/\D/g, '');
        let formattedText = formatarTelefone(numeros);
        setTelefone(formattedText);
    };

    const salvar = () => {
        if (!nome) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const fornecedorData = {
            nome,
            telefone: telefone.replace(/\D/g, ''), // Remove a formatação para salvar
            representante,
            descricao
        };

                // ...continuação da função salvar
                if (fornecedorId) {
                    FornecedorService.atualizarFornecedor(Number(fornecedorId), fornecedorData)
                        .then(response => {
                            Alert.alert('Sucesso', 'Fornecedor atualizado com sucesso!');
                            navigation.goBack();
                        })
                        .catch(error => {
                            console.error('Erro ao atualizar fornecedor:', error);
                            Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                        });
                } else {
                    FornecedorService.criarFornecedor(fornecedorData)
                        .then(response => {
                            Alert.alert('Sucesso', 'Fornecedor criado com sucesso!');
                            navigation.goBack();
                        })
                        .catch(error => {
                            console.error('Erro ao criar fornecedor:', error);
                            Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                        });
                }
            };
        
            return (
                <GlobalLayout showBackButton={true}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.container}>
                            <Text style={styles.title}>
                                {fornecedorId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                            </Text>
        
                            <Text style={styles.label}>Nome</Text>
                            <TextInput
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Digite o nome do fornecedor"
                                style={styles.input}
                            />
        
                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                value={telefone}
                                onChangeText={handleTelefoneChange}
                                placeholder="Digite o telefone do fornecedor"
                                style={styles.input}
                                keyboardType="numeric"
                            />
        
                            <Text style={styles.label}>Representante</Text>
                            <TextInput
                                value={representante}
                                onChangeText={setRepresentante}
                                placeholder="Digite o nome do representante"
                                style={styles.input}
                            />
        
                            <Text style={styles.label}>Descrição</Text>
                            <TextInput
                                value={descricao}
                                onChangeText={setDescricao}
                                placeholder="Digite uma descrição"
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
        
        export default NovoFornecedor;
        