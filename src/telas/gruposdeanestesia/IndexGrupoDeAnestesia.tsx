import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarGruposDeAnestesia from './componentes/SearchbarGruposDeAnestesia';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as GrupoDeAnestesiaService from '../../services/GrupoDeAnestesiaService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoGruposDeAnestesia from './componentes/CabecalhoGruposDeAnestesia';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

type GrupoDeAnestesia = {
    id: number;
    nome: string;
    nomeabreviado: string;
    cor: string; // Adicionando a propriedade cor
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();


const IndexGrupoDeAnestesia = () => {
    const [grupos, setGrupos] = useState<GrupoDeAnestesia[]>([]);
    const [filteredData, setFilteredData] = useState<GrupoDeAnestesia[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'grupos',
        ({ pageParam = 1 }) => GrupoDeAnestesiaService.obterTodosGruposDeAnestesia()
            .then(response => {
                console.log("API Response Data: ", response);
                return response;
            }),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const allData = React.useMemo(() => {
        if (!data) return [];
        return data.pages.flatMap(page => page.data);
    }, [data]);

    const handleDeletarGrupo = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este grupo?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarGrupoConfirmado(id) }
            ]
        );
    };

    const deletarGrupoConfirmado = async (id: number) => {
        try {
            const response = await GrupoDeAnestesiaService.deletarGrupoDeAnestesia(id);
            if (response.ok) {
                const novosGrupos = grupos.filter(grupo => grupo.id !== id);
                setGrupos(novosGrupos);
                setFilteredData(novosGrupos);
                Alert.alert("Sucesso", "Grupo excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o grupo.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o grupo:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o grupo.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            GrupoDeAnestesiaService.obterTodosGruposDeAnestesia()
            .then(response => {
                if (response.error) {
                    console.error("API Error Response:", response.error);
                } else {
                    // Ordenando os dados em ordem alfabética pelo nome
                    const dadosOrdenados = response.data.sort((a: GrupoDeAnestesia, b: GrupoDeAnestesia) => a.nome.localeCompare(b.nome));
                    setGrupos(dadosOrdenados);
                    setFilteredData(dadosOrdenados);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );
    

    useFocusEffect(
        React.useCallback(() => {
            GrupoDeAnestesiaService.obterTodosGruposDeAnestesia()
            .then(response => {
                if (response.error) {
                    console.error("API Error Response:", response.error);
                } else {
                    // Ordenando os dados em ordem alfabética pelo nome
                    const dadosOrdenados = response.data.sort((a: GrupoDeAnestesia, b: GrupoDeAnestesia) => a.nome.localeCompare(b.nome));
                    setGrupos(dadosOrdenados);
                    setFilteredData(dadosOrdenados);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );
    
    

    
    

    const handleSearchChange = (text: string) => {
        const newData = grupos.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoGruposDeAnestesia />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarGruposDeAnestesia
                            placeholder="Buscar grupo..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={scale(24)} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoGrupoDeAnestesia')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os grupos.</Text> : null}
                    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerNomeCompleto}><Text style={styles.headerText}>Grupo</Text></View>
                        <View style={styles.headerNomeAbreviado}><Text style={styles.headerText}>Abreviação</Text></View>
                        <View style={styles.headerCor}><Text style={styles.headerText}>Cor</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {Array.isArray(filteredData) && filteredData.map(grupo => (
                        <View key={grupo.id} style={styles.row}>
                            <View style={styles.cellNomeCompleto}><Text>{grupo.nome}</Text></View>
                            <View style={styles.cellNomeAbreviado}><Text>{grupo.nomeabreviado}</Text></View>
                            <View style={[styles.cellCor, { backgroundColor: grupo.cor }]}></View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoGrupoDeAnestesia', { grupoId: grupo.id })}
                                onDeletarPress={() => handleDeletarGrupo(grupo.id)}
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
    headerNomeCompleto: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(10),
    },
    headerNomeAbreviado: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingLeft: -moderateScale(20),
    },
    cellNomeCompleto: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    cellNomeAbreviado: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    headerCor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellCor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    headerAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: moderateScale(10),
    },
});

export default IndexGrupoDeAnestesia;

