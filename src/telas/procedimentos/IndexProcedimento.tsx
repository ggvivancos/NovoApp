import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarProcedimentos from './componentes/SearchbarProcedimentos';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as ProcedimentoService from '../../services/ProcedimentoService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoProcedimentos from './componentes/CabecalhoProcedimentos';

type Procedimento = {
    id: number;
    codigoTUSS: string;
    nome: string;
    nomeabreviado: string;
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();

const IndexProcedimento = () => {
    const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
    const [filteredData, setFilteredData] = useState<Procedimento[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'procedimentos',
        ({ pageParam = 1 }) => ProcedimentoService.obterProcedimentos(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handleDeletarProcedimento = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este procedimento?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarProcedimentoConfirmado(id) }
            ]
        );
    };

    const deletarProcedimentoConfirmado = async (id: number) => {
        try {
            const response = await ProcedimentoService.deletarProcedimento(id);
            if (response.ok) {
                const novosProcedimentos = procedimentos.filter(proc => proc.id !== id);
                setProcedimentos(novosProcedimentos);
                setFilteredData(novosProcedimentos);
                Alert.alert("Sucesso", "Procedimento excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o procedimento.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o procedimento:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o procedimento.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            ProcedimentoService.obterTodosProcedimentos()
            .then(procedimentosResponse => {
                const procedimentosFetched = procedimentosResponse.data;
                // Ordenar os procedimentos pelo código TUSS
                procedimentosFetched.sort((a: Procedimento, b: Procedimento) => {
                    return parseInt(a.codigoTUSS) - parseInt(b.codigoTUSS);
                });
                
                setProcedimentos(procedimentosFetched);
                setFilteredData(procedimentosFetched);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );

    const handleSearchChange = (text: string) => {
        const newData = procedimentos.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        }).sort((a: Procedimento, b: Procedimento) => {
            return parseInt(a.codigoTUSS) - parseInt(b.codigoTUSS);
        });
        setFilteredData(newData);
    };
    
    

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoProcedimentos style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarProcedimentos
                            placeholder="Buscar procedimento..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={24} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoProcedimento')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os procedimentos.</Text> : null}
                    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerCodigoTUSS}><Text style={styles.headerText}>Código TUSS</Text></View>
                        <View style={styles.headerNome}><Text style={styles.headerText}>Procedimento</Text></View>
                        <View style={styles.headerAbreviacao}><Text style={styles.headerText}>Nome Abreviado</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(proc => (
                        <View key={proc.id} style={styles.row}>
                            <View style={styles.cellCodigoTUSS}><Text>{proc.codigoTUSS}</Text></View>
                            <View style={styles.cellNome}><Text>{proc.nome}</Text></View>
                            <View style={styles.cellAbreviacao}><Text>{proc.nomeabreviado}</Text></View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoProcedimento', { procedimentoId: proc.id })}
                                onDeletarPress={() => handleDeletarProcedimento(proc.id)}
                            />
                        </View>
                    ))}
                    <Paginacao
                        currentPage={data?.pages.length || 1}
                        totalPages={data?.pages[data?.pages.length - 1]?.meta.totalPages || 1}
                        onPageChange={(page: number) => fetchNextPage({ pageParam: page })}
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
    cabecalhoPadding: {
        paddingLeft: 50,
    },
    searchAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    iconStyle: {
        marginLeft: 20,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        padding: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        backgroundColor: '#f7f7f7',
        paddingLeft: 10,
    },
    headerCodigoTUSS: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    headerNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    headerAbreviacao: {
        flex: 1.5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    headerAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        paddingLeft: 20,
    },
    cellCodigoTUSS: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellAbreviacao: {
        flex: 1.5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default IndexProcedimento;
