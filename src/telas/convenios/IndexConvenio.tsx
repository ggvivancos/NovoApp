import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarConvenios from './componentes/SearchbarConvenios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as ConvenioService from '../../services/ConvenioService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoConvenios from './componentes/CabecalhoConvenios';
import { scale, moderateScale } from 'react-native-size-matters';

type Convenio = {
    id: number;
    nome: string;
    nomeabreviado: string;
    cor: string; // Adicionando a propriedade cor
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();

const IndexConvenio = () => {
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [filteredData, setFilteredData] = useState<Convenio[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'convenios',
        ({ pageParam = 1 }) => ConvenioService.obterConvenios(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

       // Função para lidar com a exclusão de um convênio
       const handleDeletarConvenio = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este convênio?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarConvenioConfirmado(id) }
            ]
        );
    };

    // Função para confirmar a exclusão de um convênio
    const deletarConvenioConfirmado = async (id: number) => {
        try {
            const response = await ConvenioService.deletarConvenio(id);
            if (response.ok) {
                const novosConvenios = convenios.filter(conv => conv.id !== id);
                setConvenios(novosConvenios);
                setFilteredData(novosConvenios);
                Alert.alert("Sucesso", "Convenio excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o convênio.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o convênio:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o convênio.");
        }
    };

    // Efeito para buscar e ordenar os dados ao focar no componente
    useFocusEffect(
        React.useCallback(() => {
            ConvenioService.obterTodosConvenios()
            .then(conveniosResponse => {
                const conveniosFetched = conveniosResponse.data;
                // Ordenando os dados em ordem alfabética pelo nome
                const dadosOrdenados = conveniosFetched.sort((a: Convenio, b: Convenio) => a.nome.localeCompare(b.nome));
                setConvenios(dadosOrdenados);
                setFilteredData(dadosOrdenados);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );

    // Função para lidar com mudanças na barra de pesquisa
    const handleSearchChange = (text: string) => {
        const newData = convenios.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoConvenios />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarConvenios
                            placeholder="Buscar convênio..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={scale(24)} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoConvenio')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os convênios.</Text> : null}
                    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerNomeCompleto}><Text style={styles.headerText}>Convênio</Text></View>
                        <View style={styles.headerNomeAbreviado}><Text style={styles.headerText}>Abreviação</Text></View>
                        <View style={styles.headerCor}><Text style={styles.headerText}>Cor</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(conv => (
                        <View key={conv.id} style={styles.row}>
                            <View style={styles.cellNomeCompleto}><Text>{conv.nome}</Text></View>
                            <View style={styles.cellNomeAbreviado}><Text>{conv.nomeabreviado}</Text></View>
                            <View style={[styles.cellCor, { backgroundColor: conv.cor }]}></View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoConvenio', { convenioId: conv.id })}
                                onDeletarPress={() => handleDeletarConvenio(conv.id)}
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

export default IndexConvenio;


