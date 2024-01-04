import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarFornecedores from './componentes/SearchbarFornecedores';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as FornecedorService from '../../services/FornecedorService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoFornecedores from './componentes/CabecalhoFornecedores';
import { scale, moderateScale } from 'react-native-size-matters';

type Fornecedor = {
    id: number;
    nome: string;
    telefone: string;
    representante: string;
    descricao: string;
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();

const IndexFornecedor = () => {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [filteredData, setFilteredData] = useState<Fornecedor[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'fornecedores',
        ({ pageParam = 1 }) => FornecedorService.obterFornecedores(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handleDeletarFornecedor = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este fornecedor?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarFornecedorConfirmado(id) }
            ]
        );
    };

    const deletarFornecedorConfirmado = async (id: number) => {
        try {
            const response = await FornecedorService.deletarFornecedor(id);
            if (response.ok) {
                const novosFornecedores = fornecedores.filter(fornecedor => fornecedor.id !== id);
                setFornecedores(novosFornecedores);
                setFilteredData(novosFornecedores);
                Alert.alert("Sucesso", "Fornecedor excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o fornecedor.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o fornecedor:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o fornecedor.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            FornecedorService.obterTodosFornecedores()
            .then(fornecedoresResponse => {
                const fornecedoresFetched = fornecedoresResponse.data;
                const dadosOrdenados = fornecedoresFetched.sort((a: Fornecedor, b: Fornecedor) => a.nome.localeCompare(b.nome));
                setFornecedores(dadosOrdenados);
                setFilteredData(dadosOrdenados);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );

    const handleSearchChange = (text: string) => {
        const newData = fornecedores.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoFornecedores />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarFornecedores
                            placeholder="Buscar fornecedor..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={scale(24)} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoFornecedor')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os fornecedores.</Text> : null}
                    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerNome}><Text style={styles.headerText}>Nome</Text></View>
                        <View style={styles.headerTelefone}><Text style={styles.headerText}>Telefone</Text></View>
                        <View style={styles.headerRepresentante}><Text style={styles.headerText}>Representante</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(fornecedor => (
                        <View key={fornecedor.id} style={styles.row}>
                            <View style={styles.cellNome}><Text>{fornecedor.nome}</Text></View>
                            <View style={styles.cellTelefone}><Text>{fornecedor.telefone}</Text></View>
                            <View style={styles.cellRepresentante}><Text>{fornecedor.representante}</Text></View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoFornecedor', { fornecedorId: fornecedor.id })}
                                onDeletarPress={() => handleDeletarFornecedor(fornecedor.id)}
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
    headerNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(10),
    },
    headerTelefone: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(10),
    },
    cellNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    cellTelefone: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    headerRepresentante: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellRepresentante: {
        flex: 2,
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

export default IndexFornecedor;
