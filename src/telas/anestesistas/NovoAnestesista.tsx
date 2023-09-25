import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import ModalModelo from '../../componentes/models/ModalModelo';
import * as AnestesistaService from '../../services/AnestesistaService';
import * as GrupoDeAnestesiaService from '../../services/GrupoDeAnestesiaService';



type GrupoDeAnestesia = {
    id: number;
    nome: string;
    nomeabreviado: string;
    createdAt: string;
    updatedAt: string;
};

type RouteParams = {
    anestesistaId?: string;
}




const NovoAnestesista = () => {
    const navigation = useNavigation();
    const route = useRoute();
    console.log("Params received in NovoAnestesista:", route.params);
    const params = route.params as RouteParams;
    const anestesistaId = params?.anestesistaId;

    const [grupos, setGrupos] = useState<GrupoDeAnestesia[]>([]);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [nomeAbreviado, setNomeAbreviado] = useState('');
    const [iniciais, setIniciais] = useState('');
    const [grupoSelecionado, setGrupoSelecionado] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (anestesistaId) {
            console.log("Fetching anestesista with ID:", anestesistaId); 
            AnestesistaService.obterAnestesistaPorId(anestesistaId).then((anestesista: any) => {
                console.log("Anestesista fetched:", anestesista);  
                setNomeCompleto(anestesista.nomecompleto);
                setNomeAbreviado(anestesista.nomeabreviado);
                setIniciais(anestesista.iniciais);
                setGrupoSelecionado(anestesista.grupodeanestesiaId);
            }).catch((err: any) => {
                console.error("Erro ao buscar anestesista:", err);
            });
        }
    }, [anestesistaId]);
    
    

    useEffect(() => {
        GrupoDeAnestesiaService.obterTodosGruposDeAnestesia()
            .then(data => {
                const sortedData: GrupoDeAnestesia[] = data.sort((a: GrupoDeAnestesia, b: GrupoDeAnestesia) => a.nome.localeCompare(b.nome));
                setGrupos(sortedData);
            })
            .catch(error => console.error('Erro ao buscar grupos:', error));
    }, []);

    const salvar = () => {
        if (!nomeCompleto || !nomeAbreviado || !iniciais) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
    
        const anestesistaData = {
            nomecompleto: nomeCompleto,
            nomeabreviado: nomeAbreviado,
            iniciais,
            grupodeanestesiaId: grupoSelecionado
        };
    
        if (anestesistaId) {
            AnestesistaService.atualizarAnestesista(Number(anestesistaId), anestesistaData)
                .then(data => {
                    if (data && data.success) {
                        Alert.alert('Sucesso', data.success);  
                        navigation.goBack();
                    } else {
                        Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao atualizar anestesista:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            AnestesistaService.criarAnestesista(anestesistaData)
                .then(data => {
                    if (data && data.id) {
                        Alert.alert('Sucesso', 'Anestesista salvo com sucesso!');
                        navigation.goBack();
                    } else if (data && data.error) {
                        if (data.error.includes("Nome Completo") || data.error.includes("Nome abreviado")) {
                            Alert.alert('Erro', 'Nome Completo ou Nome Abreviado já existe.');
                        } else {
                            Alert.alert('Erro', data.error);
                        }
                    } else {
                        Alert.alert('Erro', 'Erro ao salvar. Tente novamente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao salvar anestesista:', error);
                    Alert.alert('Erro', 'Erro ao salvar. Tente novamente.');
                });
        }
    };
    
    

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                <View style={styles.container}>

                    <Text style={styles.title}>
                    {anestesistaId ? 'Editar Anestesista' : 'Novo Anestesista'}
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

                    <Text style={styles.label}>Iniciais</Text>
                    <TextInput
                        value={iniciais}
                        onChangeText={setIniciais}
                        placeholder="Digite as iniciais"
                        placeholderTextColor="#888888"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Grupo de Anestesia</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputSelector}>
                        <Text style={styles.inputText}>
                            {grupoSelecionado 
                                ? grupos.find(grupo => grupo.id === grupoSelecionado)?.nome 
                                : "Selecione um grupo de anestesia"
                            }
                        </Text>
                    </TouchableOpacity>

                    <ModalModelo
                        isVisible={isModalVisible}
                        onDismiss={() => setModalVisible(false)}
                        onItemSelected={(id: React.SetStateAction<number | null>) => {
                            setGrupoSelecionado(id);
                            setModalVisible(false);
                        }}
                        items={grupos.map(grupo => ({
                            id: grupo.id,
                            label: grupo.nome
                        }))}
                        title="Grupos de Anestesia"
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

export default NovoAnestesista;
