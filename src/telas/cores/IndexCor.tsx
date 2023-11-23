import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarCores from './componentes/SearchbarCores';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as CorService from '../../services/CorService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoCores from './componentes/CabecalhoCores';
import Slider from '@react-native-community/slider';

type Cor = {
    id: number;
    nome: string;
    valorHexadecimal: string;
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();

const IndexCor = () => {
    const [cores, setCores] = useState<Cor[]>([]);
    const [filteredData, setFilteredData] = useState<Cor[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'cores',
        ({ pageParam = 1 }) => CorService.obterCores(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handleDeletarCor = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir esta cor?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarCorConfirmado(id) }
            ]
        );
    };

    const deletarCorConfirmado = async (id: number) => {
        try {
            const response = await CorService.deletarCor(id);
            if (response.ok) {
                const novasCores = cores.filter(cor => cor.id !== id);
                setCores(novasCores);
                setFilteredData(novasCores);
                Alert.alert("Sucesso", "Cor excluída com sucesso.");
            } else {
                throw new Error("Falha ao excluir a cor.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar a cor:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir a cor.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            CorService.obterTodasCores()
            .then(coresResponse => {
                const coresFetched = coresResponse.data;
                console.log("coresFetched:", coresFetched);
                setCores(coresFetched);
                setFilteredData(coresFetched);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );
    
    const handleSearchChange = (text: string) => {
        const newData = cores.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoCores style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarCores
                            placeholder="Buscar cor..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={24} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoCor')}
                        />
                    </View>
    
                    {isLoading && <Text>Carregando...</Text>}
                    {error && <Text>Erro ao carregar as cores.</Text>}
    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerNome}><Text style={styles.headerText}>Nome</Text></View>
                        <View style={styles.headerValorHexadecimal}><Text style={styles.headerText}>Valor Hexadecimal</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>
    
                    {filteredData.map(cor => (
                        <View key={cor.id} style={styles.row}>
                            <View style={styles.cellNome}><Text>{cor.nome}</Text></View>
                            <View style={styles.cellValorHexadecimal}>
                                <Text>{cor.valorHexadecimal}</Text>
                                <View style={[styles.colorBox, { backgroundColor: cor.valorHexadecimal }]} />
                            </View>

                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoCor', { corId: cor.id })}
                                onDeletarPress={() => handleDeletarCor(cor.id)}
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
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        paddingLeft: 20,
    },
    headerNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    headerValorHexadecimal: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    headerAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    cellNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    cellValorHexadecimal: {
        flex: 2,
        flexDirection: 'row',  // Adicione esta linha
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorBox: {
        width: 20,
        height: 20,
        marginLeft: 5,
        borderWidth: 1,
        borderColor: '#ddd'
    }
    
});

export default IndexCor;
