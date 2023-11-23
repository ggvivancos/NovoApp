import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as GrupoDeAnestesiaService from '../../services/GrupoDeAnestesiaService';

type RouteParams = {
    grupoId?: string;
}

const NovoGrupoDeAnestesia = () => {
    const navigation = useNavigation();
    const route = useRoute();
    console.log("Params received in NovoGrupoDeAnestesia:", route.params);
    const params = route.params as RouteParams;
    const grupoId = params?.grupoId;

    const [nome, setNome] = useState('');
    const [nomeAbreviado, setNomeAbreviado] = useState('');

    useEffect(() => {
        if (grupoId) {
            console.log("Fetching grupo with ID:", grupoId);
            
            // Convertendo grupoId para número
            GrupoDeAnestesiaService.obterGrupoDeAnestesiaPorId(Number(grupoId)).then((grupo: any) => {
                console.log("Grupo fetched:", grupo);  
                setNome(grupo.nome);
                setNomeAbreviado(grupo.nomeabreviado);
            }).catch((err: any) => {
                console.error("Erro ao buscar grupo:", err);
            });
        }
    }, [grupoId]);
    
    
    
    
    const salvar = () => {
        if (!nome || !nomeAbreviado) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
    
        const grupoData = {
            nome: nome,
            nomeabreviado: nomeAbreviado
        };
    
        if (grupoId) {
            GrupoDeAnestesiaService.atualizarGrupoDeAnestesia(Number(grupoId), grupoData)
                .then(data => {
                    if (data && data.success) {
                        Alert.alert('Sucesso', data.success);  
                        navigation.goBack();
                    } else {
                        Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao atualizar grupo:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            GrupoDeAnestesiaService.criarGrupoDeAnestesia(grupoData)
                .then(data => {
                    if (data && data.id) {
                        Alert.alert('Sucesso', 'Grupo salvo com sucesso!');
                        navigation.goBack();
                    } else if (data && data.error) {
                        Alert.alert('Erro', data.error);
                    } else {
                        Alert.alert('Erro', 'Erro ao salvar. Tente novamente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao salvar grupo:', error);
                    Alert.alert('Erro', 'Erro ao salvar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                <View style={styles.container}>

                    <Text style={styles.title}>
                        {grupoId ? 'Editar Grupo de Anestesia' : 'Novo Grupo de Anestesia'}
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

export default NovoGrupoDeAnestesia;
