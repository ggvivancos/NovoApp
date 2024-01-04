import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as OPMEService from '../../services/OPMEService';
import * as FornecedorService from '../../services/FornecedorService';
import ModalCheckBox from '../../componentes/models/ModalCheckBox';

type RouteParams = {
    opmeId?: string;
}

interface Fornecedor {
    id: number;
    nome: string;
}

const NovoOPME = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const opmeId = params?.opmeId;

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<number[]>([]);
    const [mostrarModalFornecedores, setMostrarModalFornecedores] = useState(false);

    useEffect(() => {
        FornecedorService.obterTodosFornecedores()
            .then(response => {
                setFornecedores(response.data);
            })
            .catch(error => console.error('Erro ao buscar fornecedores:', error));

        if (opmeId) {
            OPMEService.obterOPMEPorId(opmeId)
                .then((opme: any) => {
                    setNome(opme.nome);
                    setDescricao(opme.descricao);
                    setFornecedoresSelecionados(opme.fornecedores.map((f: Fornecedor) => f.id) || []);
                })
                .catch(err => console.error("Erro ao buscar OPME:", err));
        }
    }, [opmeId]);

    const handleFornecedorSelect = (fornecedorId: number) => {
        setFornecedoresSelecionados(prev => {
            if (prev.includes(fornecedorId)) {
                return prev.filter(id => id !== fornecedorId);
            } else {
                return [...prev, fornecedorId];
            }
        });
    };

    const salvar = () => {
        if (!nome) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const opmeData = {
            nome,
            descricao,
            fornecedores: fornecedoresSelecionados
        };

        if (opmeId) {
            OPMEService.atualizarOPME(Number(opmeId), opmeData)
                .then(response => {
                    Alert.alert('Sucesso', 'OPME atualizada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar OPME:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            OPMEService.criarOPME(opmeData)
                .then(response => {
                    Alert.alert('Sucesso', 'OPME criada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar OPME:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    const renderFornecedorBox = (id: number) => {
        const fornecedor = fornecedores.find(f => f.id === id);
        return (
            <View key={id} style={styles.fornecedorBox}>
                <Text style={styles.fornecedorBoxText}>{fornecedor?.nome}</Text>
                <TouchableOpacity onPress={() => handleFornecedorSelect(id)} style={styles.fornecedorBoxRemove}>
                    <Text style={styles.fornecedorBoxRemoveText}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };

        // ...continuação do componente NovoOPME

        return (
            <GlobalLayout showBackButton={true}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <Text style={styles.title}>
                            {opmeId ? 'Editar OPME' : 'Nova OPME'}
                        </Text>
    
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Digite o nome da OPME"
                            style={styles.input}
                        />
    
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            value={descricao}
                            onChangeText={setDescricao}
                            placeholder="Digite a descrição da OPME"
                            style={styles.input}
                            multiline
                        />
    
                        <Text style={styles.label}>Fornecedores</Text>
                        <TouchableOpacity 
                            onPress={() => setMostrarModalFornecedores(true)} 
                            style={styles.inputSelector}
                        >
                            <View style={styles.fornecedoresContainer}>
                                {fornecedoresSelecionados.map(renderFornecedorBox)}
                            </View>
                        </TouchableOpacity>
    
                        <ModalCheckBox
                            isVisible={mostrarModalFornecedores}
                            onDismiss={() => setMostrarModalFornecedores(false)}
                            onItemSelected={handleFornecedorSelect}
                            items={fornecedores.map(fornecedor => ({ id: fornecedor.id, label: fornecedor.nome }))}
                            selectedItems={fornecedoresSelecionados}
                            title="Selecione os Fornecedores"
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
        scrollView: {
            flex: 1,
        },
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
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#333',
            textAlign: 'center'
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
        inputSelector: {
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
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 10
        },
        fornecedoresContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        fornecedorBox: {
            flexDirection: 'row',
            backgroundColor: '#e1e1e1',
            borderRadius: 5,
            padding: 5,
            marginRight: 5,
            marginTop: 5,
        },
        fornecedorBoxText: {
            fontSize: 14,
            marginRight: 5,
            color: 'black',
        },
        fornecedorBoxRemove: {
            backgroundColor: 'red',
            borderRadius: 10,
            padding: 2,
        },
        fornecedorBoxRemoveText: {
            color: 'white',
            fontSize: 12,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
    });
    
    export default NovoOPME;
    
