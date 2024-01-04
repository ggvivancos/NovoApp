import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarRecursosComplementares from './componentes/SearchbarRecursosComplementares';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as RecursoComplementarService from '../../services/RecursoComplementarService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoRecursosComplementares from './componentes/CabecalhoRecursosComplementares';
import { scale, moderateScale } from 'react-native-size-matters';

type RecursoComplementar = {
    id: number;
    recurso: string;
    descricao: string;
    quantidadeDisponivel: number;
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();

const IndexRecursoComplementar = () => {
    const [recursos, setRecursos] = useState<RecursoComplementar[]>([]);
    const [filteredData, setFilteredData] = useState<RecursoComplementar[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'recursosComplementares',
        ({ pageParam = 1 }) => RecursoComplementarService.obterRecursosComplementares(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    // Função para lidar com a exclusão de um recurso complementar
    const handleDeletarRecurso = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este recurso complementar?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarRecursoConfirmado(id) }
            ]
        );
    };

    // Função para confirmar a exclusão de um recurso complementar
    const deletarRecursoConfirmado = async (id: number) => {
        try {
            const response = await RecursoComplementarService.deletarRecursoComplementar(id);
            if (response.ok) {
                const novosRecursos = recursos.filter(recurso => recurso.id !== id);
                setRecursos(novosRecursos);
                setFilteredData(novosRecursos);
                Alert.alert("Sucesso", "Recurso complementar excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o recurso complementar.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o recurso complementar:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o recurso complementar.");
        }
    };

    // Efeito para buscar e ordenar os dados ao focar no componente
    useFocusEffect(
        React.useCallback(() => {
            RecursoComplementarService.obterTodosRecursosComplementares()
            .then(recursosResponse => {
                const recursosFetched = recursosResponse.data;
                const dadosOrdenados = recursosFetched.sort((a: RecursoComplementar, b: RecursoComplementar) => a.recurso.localeCompare(b.recurso));
                setRecursos(dadosOrdenados);
                setFilteredData(dadosOrdenados);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );

    const handleSearchChange = (text: string) => {
        const newData = recursos.filter(item => {
            const itemData = item.recurso.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoRecursosComplementares />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarRecursosComplementares
                            placeholder="Buscar recurso complementar..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={scale(24)} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoRecursoComplementar')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os recursos complementares.</Text> : null}
                    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerRecurso}><Text style={styles.headerText}>Recurso</Text></View>
                        <View style={styles.headerDescricao}><Text style={styles.headerText}>Descrição</Text></View>
                        <View style={styles.headerQuantidade}><Text style={styles.headerText}>Quantidade</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(recurso => (
                        <View key={recurso.id} style={styles.row}>
                            <View style={styles.cellRecurso}><Text>{recurso.recurso}</Text></View>
                            <View style={styles.cellDescricao}><Text>{recurso.descricao}</Text></View>
                            <View style={styles.cellQuantidade}><Text>{recurso.quantidadeDisponivel}</Text></View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoRecursoComplementar', { recursoId: recurso.id })}
                                onDeletarPress={() => handleDeletarRecurso(recurso.id)}
                            />
                        </View>
                    ))}
                    <Paginacao
                        currentPage={data?.pages.length || 1}
                        totalPages={data?.pages[data?.pages.length - 1]?.meta.totalPages || 1}
                        onPageChange={(page: number) => { }}
                    />
                </ScrollView>
            </QueryClientProvider>
        </GlobalLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: moderateScale(10),
    },
    iconStyle: {
        marginLeft: moderateScale(15),
    },
    headerText: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        color: '#000',
        padding: moderateScale(10),
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: moderateScale(10),
        backgroundColor: '#f7f7f7',
        paddingLeft: moderateScale(10),
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: moderateScale(10),
        paddingLeft: moderateScale(10),
    },
    headerRecurso: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(10),
    },
    headerDescricao: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(10),
    },
    cellRecurso: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    cellDescricao: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    headerQuantidade: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellQuantidade: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: moderateScale(10),
    },
});

export default IndexRecursoComplementar;
