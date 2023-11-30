import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import CabecalhoStatus from './componentes/CabecalhoStatus'; 
import GlobalLayout from '../../layouts/GlobalLayout';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchbarStatus from './componentes/SearchbarStatus'; 
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes'; 
import * as StatusService from '../../services/StatusService'; 
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao, { PaginacaoProps } from '../../componentes/paginacao/Paginacao';

type Status = {
    id: string;
    nome: string;
    cor: string;
    nomeabreviado: string | null;
};

const queryClient = new QueryClient();

const IndexStatus = () => {
    const [status, setStatus] = useState<Status[]>([]);
    const [filteredData, setFilteredData] = useState<Status[]>([]);
    const navigation = useNavigation();
    const [currentPageState, setCurrentPageState] = useState<number>(1);

    // Substitua 'status' por sua lógica de API
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'status',
        ({ pageParam = 1 }) => StatusService.obterStatus(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    // Substitua 'StatusService' por sua lógica de serviço
    const handlePageChange = async (newPage: number) => {
        try {
            const response = await StatusService.obterStatus(25, newPage); 
            if(response && Array.isArray(response.data)) {
                const sortedData = response.data.sort((a: Status, b: Status) => a.nome.localeCompare(b.nome));
                setStatus(sortedData);
                setFilteredData(sortedData);
            }
        } catch (error) {
            console.error("Erro ao buscar dados da página:", newPage, error);
        }
    };

    const handleDeletarStatus = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este status?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarStatusConfirmado(id) }
            ]
        );
    };

    const deletarStatusConfirmado = async (id: number) => {
        try {
            const response = await StatusService.deletarStatus(id);
            if (response.ok) {
                const novosStatus = status.filter(item => item.id !== id.toString());
                setStatus(novosStatus);
                setFilteredData(novosStatus);
                Alert.alert("Sucesso", "Status excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o status.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o status:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o status.");
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchStatus = async () => {
                try {
                    const response = await StatusService.obterStatus();
                    if (response && Array.isArray(response.data)) {
                        const sortedStatus = response.data.sort((a: Status, b: Status) => a.nome.localeCompare(b.nome));
                        setStatus(sortedStatus);
                        setFilteredData(sortedStatus);
                    }
                } catch (error) {
                    console.error('Erro ao buscar status:', error);
                }
            };

            fetchStatus();
        }, [])
    );

    const handleSearchChange = (text: string) => {
        const newData = status.filter(item => {
            const itemDataNome = item.nome ? item.nome.toUpperCase() : '';
            const itemDataNomeAbreviado = item.nomeabreviado ? item.nomeabreviado.toUpperCase() : '';
            const itemDataCor = item.cor ? item.cor.toUpperCase() : '';
            const textData = text.toUpperCase();
    
            return itemDataNome.indexOf(textData) > -1 || 
                   itemDataNomeAbreviado.indexOf(textData) > -1 || 
                   itemDataCor.indexOf(textData) > -1;
        });
    
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoStatus style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <View style={styles.searchAndFilterContainer}>
                    <SearchbarStatus 
                        onSearchChange={handleSearchChange}
                        onSearchSubmit={() => console.log("Botão Ir pressionado")}
                    />
                    <View style={styles.iconsContainer} />
                    <Icon 
                        name="plus" 
                        size={24} 
                        color="#000" 
                        style={styles.iconStyle}
                        onPress={() => (navigation as any).navigate('NovoStatus')}
                    />
                </View>
                {isLoading && <Text>Carregando...</Text>}
                {error ? <Text>Erro ao carregar os status.</Text> : null}

                <ScrollView>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={styles.cellNome}><Text style={styles.headerText}>Nome</Text></View>
                            <View style={styles.cellNomeAbreviado}><Text style={styles.headerText}>Nome Abreviado</Text></View>
                            <View style={styles.cellCor}><Text style={styles.headerText}>Cor</Text></View>
                            <View style={styles.cellAcoes}><Text style={styles.headerText}>Ações</Text></View>
                        </View>                     

                        {filteredData.map(item => (
                            <View key={item.id} style={styles.row}>
                                <View style={styles.cellNome}><Text>{item.nome}</Text></View>
                                <View style={styles.cellNomeAbreviado}><Text>{item.nomeabreviado}</Text></View>
                                <View style={[styles.cellCor, { backgroundColor: item.cor }]}></View>
                                <AcoesBotoes 
                                    onEditarPress={() => (navigation as any).navigate('NovoStatus', { statusId: item.id })}
                                    onDeletarPress={() => handleDeletarStatus(Number(item.id))}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <Paginacao
                    currentPage={currentPageState}
                    totalPages={data?.pages[data?.pages.length - 1]?.meta.totalPages || 1}
                    onPageChange={handlePageChange}
                />
            </QueryClientProvider>
        </GlobalLayout>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cabecalhoPadding: {
        paddingLeft: 50, // Ajuste esse valor conforme necessário
    },
    table: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    headerText: {
        fontWeight: 'bold',
    },
    cellNome: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellNomeAbreviado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellCor: {
        flex: 0.3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 20,
        width: 10,
        borderRadius: 5,
        marginRight: 55,
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 0,
    },
    searchAndFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 0.15,
    },
    iconStyle: {
        marginLeft: 10,
    },
});

export default IndexStatus;
