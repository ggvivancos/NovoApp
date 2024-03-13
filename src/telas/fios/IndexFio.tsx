import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarFios from './componentes/SearchbarFios'; // Componente de busca adaptado para "Fios"
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as FioService from '../../services/FioService'; // Serviço adaptado para "Fios"
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoFios from './componentes/CabecalhoFios'; // Cabeçalho adaptado para "Fios"
import { scale, moderateScale } from 'react-native-size-matters';

type Fio = {
    id: number;
    nome: string;
    descricao: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();

const IndexFios = () => {
    const [fios, setFios] = useState<Fio[]>([]);
    const [filteredData, setFilteredData] = useState<Fio[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'fios',
        ({ pageParam = 1 }) => FioService.obterFios(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    // Função para lidar com a exclusão de um fio
const handleDeletarFio = async (id: number) => {
    Alert.alert(
        "Confirmação",
        "Tem certeza de que deseja excluir este fio?",
        [
            { text: "Cancelar", style: "cancel" },
            { text: "Sim", onPress: () => deletarFioConfirmado(id) }
        ]
    );
};

// Função para confirmar a exclusão de um fio
const deletarFioConfirmado = async (id: number) => {
    try {
        const response = await FioService.deletarFio(id);
        if (response.ok) {
            const novosFios = fios.filter(fio => fio.id !== id);
            setFios(novosFios);
            setFilteredData(novosFios);
            Alert.alert("Sucesso", "Fio excluído com sucesso.");
        } else {
            throw new Error("Falha ao excluir o fio.");
        }
    } catch (erro) {
        console.error("Ocorreu um erro ao deletar o fio:", erro);
        Alert.alert("Erro", "Houve um erro ao excluir o fio.");
    }
};

useFocusEffect(
    React.useCallback(() => {
        FioService.obterTodosFios()
        .then(fiosResponse => {
            const fiosFetched = fiosResponse.data;
            const dadosOrdenados = fiosFetched.sort((a: Fio, b: Fio) => a.nome.localeCompare(b.nome));
            setFios(dadosOrdenados);
            setFilteredData(dadosOrdenados);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
    }, [])
);



const handleSearchChange = (text: string) => {
    const newData = fios.filter(fio => {
        const itemData = `${fio.nome.toUpperCase()}   
        ${fio.descricao.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    setFilteredData(newData);
};


    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoFios />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarFios
                            placeholder="Buscar fio..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={scale(24)} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoFio')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os fios.</Text> : null}

                    <View style={styles.tableHeader}>
                        <View style={styles.headerNome}><Text style={styles.headerText}>Nome</Text></View>
                        <View style={styles.headerDescricao}><Text style={styles.headerText}>Marca do Fio</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(fio => (
                        <View key={fio.id} style={styles.row}>
                            <View style={styles.cellNome}><Text>{fio.nome}</Text></View>
                            <View style={styles.cellDescricao}><Text>{fio.descricao}</Text></View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoFio', { fioId: fio.id })}
                                onDeletarPress={() => handleDeletarFio(fio.id)}
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
        marginLeft: moderateScale(10),
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        padding: moderateScale(5),
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
    headerDescricao: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(40),
    },
    cellNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(10),
    },
    cellDescricao: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: moderateScale(0),
    },
    
    headerAcoes: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: moderateScale(0),
    },
});


export default IndexFios;
