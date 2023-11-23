import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarConvenios from './componentes/SearchbarConvenios';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as ConvenioService from '../../services/ConvenioService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoConvenios from './componentes/CabecalhoConvenios';

type Convenio = {
    id: number;
    nome: string;
    nomeabreviado: string;
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

    useFocusEffect(
        React.useCallback(() => {
            ConvenioService.obterTodosConvenios()
            .then(conveniosResponse => {
                const conveniosFetched = conveniosResponse.data;
                console.log("conveniosFetched:", conveniosFetched);
                setConvenios(conveniosFetched);
                setFilteredData(conveniosFetched);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );
    
    const handleSearchChange = (text: string) => {
        const newData = convenios.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoConvenios style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarConvenios
                            placeholder="Buscar convênio..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={24} 
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
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                     </View>

                    {filteredData.map(conv => (
                        <View key={conv.id} style={styles.row}>
                            <View style={styles.cellNomeCompleto}><Text>{conv.nome}</Text></View>
                            <View style={styles.cellNomeAbreviado}><Text>{conv.nomeabreviado}</Text></View>
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
    cabecalhoPadding: {
        paddingLeft: 50,
    },
    searchAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
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
    table: {
        flex: 1,
        padding: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        backgroundColor: '#f7f7f7',
        paddingLeft: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.0,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        paddingLeft: 20,
    },
    headerNomeCompleto: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    headerNomeAbreviado: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingLeft: -20,
    },
    headerAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 0,
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
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default IndexConvenio;
