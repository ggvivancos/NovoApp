import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import ModalModelo from '../../componentes/models/ModalModelo';
import * as CirurgiaoService from '../../services/CirurgiaoService';
import * as EspecialidadeService from '../../services/EspecialidadeService';

type Especialidade = {
    id: number;
    nome: string;
    nomeabreviado: string;
    createdAt: string;
    updatedAt: string;
};

type RouteParams = {
    cirurgiaoId?: string;
}

const NovoCirurgiao = () => {
    const navigation = useNavigation();
    const route = useRoute();
    console.log("Params received in NovoCirurgiao:", route.params);
    const params = route.params as RouteParams;
    const cirurgiaoId = params?.cirurgiaoId;
    
    console.log('Cirurgião ID:', cirurgiaoId);

    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [nomeAbreviado, setNomeAbreviado] = useState('');
    const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        EspecialidadeService.obterTodasEspecialidades()
    .then(response => {
        console.log("Data received for especialidades:", response);
        const data = response.data;
        if (Array.isArray(data)) {
            const sortedData: Especialidade[] = data.sort((a, b) => a.nome.localeCompare(b.nome));
            setEspecialidades(sortedData);
        } else {
            console.error("Data is not an array:", data);
        }
    })
    .catch(error => console.error('Erro completo ao buscar especialidades:', error));

    
    }, []);

    useEffect(() => {
        if (cirurgiaoId) {
            console.log("Fetching cirurgiao with ID:", cirurgiaoId);
            CirurgiaoService.obterCirurgiaoPorId(cirurgiaoId)
                .then((cirurgiao: any) => {
                    console.log("Cirurgiao fetched:", cirurgiao);
                    setNomeCompleto(cirurgiao.nome);
                    setNomeAbreviado(cirurgiao.nomeabreviado);
                    setEspecialidadeSelecionada(cirurgiao.especialidadeId);
                })
                .catch(err => console.error("Erro ao buscar cirurgião:", err));
        }
    }, [cirurgiaoId]);

    const salvar = () => {
        if (!nomeCompleto || !nomeAbreviado) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const cirurgiaoData = {
            nome: nomeCompleto,
            nomeabreviado: nomeAbreviado,
            especialidadeId: especialidadeSelecionada
        };

        if (cirurgiaoId) {
            CirurgiaoService.atualizarCirurgiao(Number(cirurgiaoId), cirurgiaoData)
                .then(response => {
                    Alert.alert('Sucesso', 'Cirurgião atualizado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar cirurgião:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            CirurgiaoService.criarCirurgiao(cirurgiaoData)
                .then(response => {
                    Alert.alert('Sucesso', 'Cirurgião criado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar cirurgião:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {cirurgiaoId ? 'Editar Cirurgião' : 'Novo Cirurgião'}
                    </Text>

                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput
                        value={nomeCompleto}
                        onChangeText={setNomeCompleto}
                        placeholder="Digite o nome completo"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Nome Abreviado</Text>
                    <TextInput
                        value={nomeAbreviado}
                        onChangeText={setNomeAbreviado}
                        placeholder="Digite o nome abreviado"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Especialidade</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputSelector}>
                        <Text style={styles.inputText}>
                            {especialidadeSelecionada
                                ? especialidades.find(especialidade => especialidade.id === especialidadeSelecionada)?.nome
                                : "Selecione uma especialidade"
                            }
                        </Text>
                    </TouchableOpacity>

                    <ModalModelo
                        isVisible={isModalVisible}
                        onDismiss={() => setModalVisible(false)}
                        onItemSelected={(id) => {
                            setEspecialidadeSelecionada(id);
                            setModalVisible(false);
                        }}
                        items={especialidades.map(especialidade => ({
                            id: especialidade.id,
                            label: especialidade.nome
                        }))}
                        title="Especialidades"
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
    inputText: {
        color: '#888888'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
    },
});

export default NovoCirurgiao;
