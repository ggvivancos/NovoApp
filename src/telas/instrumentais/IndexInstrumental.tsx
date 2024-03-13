import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import CabecalhoInstrumentais from './componentes/CabecalhoInstrumentais';
import GlobalLayout from '../../layouts/GlobalLayout';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchbarInstrumentais from './componentes/SearchbarInstrumentais';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes'; 
import * as InstrumentalService from '../../services/InstrumentalService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao, { PaginacaoProps } from '../../componentes/paginacao/Paginacao';
import GenericFilter from '../../componentes/utilities/GenericFilter';

type Instrumental = {
    id: number;
    nome: string;
    descricao: string;
    quantidadeDisponivel: number;
    isDeleted: boolean;
};

const queryClient = new QueryClient();

const IndexInstrumental = () => {
    const [instrumentais, setInstrumentais] = useState<Instrumental[]>([]);
    const [filteredData, setFilteredData] = useState<Instrumental[]>([]);
    const navigation = useNavigation();
    const [currentPageState, setCurrentPageState] = useState<number>(1);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'instrumentais',
        ({ pageParam = 1 }) => InstrumentalService.obterInstrumentais(25, pageParam), // Adapte esta função ao seu serviço
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handlePageChange = async (newPage: number) => {
        setCurrentPageState(newPage);
        try {
            const response = await InstrumentalService.obterInstrumentais(25, newPage); // Adapte esta função ao seu serviço
            if(response && Array.isArray(response.data)) {
                const sortedData = response.data.sort((a: Instrumental, b: Instrumental) => a.nome.localeCompare(b.nome));
                setInstrumentais(sortedData);
                setFilteredData(sortedData);
            }
        } catch (error) {
            console.error("Erro ao buscar dados da página:", newPage, error);
        }
    };

    const handleDeletarInstrumental = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este instrumental?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarInstrumentalConfirmado(id) }
            ]
        );
    };

    const deletarInstrumentalConfirmado = async (id: number) => {
        try {
            const response = await InstrumentalService.deletarInstrumental(id); // Adapte esta função ao seu serviço
            if (response.ok) {
                const novosInstrumentais = instrumentais.filter(instr => instr.id !== id);
                setInstrumentais(novosInstrumentais);
                setFilteredData(novosInstrumentais);
                Alert.alert("Sucesso", "Instrumental excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o instrumental.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o instrumental:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o instrumental.");
        }
    }

    const handleSearchChange = (text: string) => {
        const newData = instrumentais.filter(item => {
            const itemData = item.nome ? item.nome.toUpperCase() : '';
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchInstrumentais = async () => {
                try {
                    const response = await InstrumentalService.obterInstrumentais(); // Adapte esta função ao seu serviço
                    if (response && Array.isArray(response.data)) {
                        const sortedInstrumentais = response.data.sort((a: Instrumental, b: Instrumental) => a.nome.localeCompare(b.nome));
                        setInstrumentais(sortedInstrumentais);
                        setFilteredData(sortedInstrumentais);
                    }
                } catch (error) {
                    console.error('Erro ao buscar instrumentais:', error);
                }
            };
            fetchInstrumentais();
        }, [])
    );

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoInstrumentais style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <View style={styles.searchAndFilterContainer}>
                    <SearchbarInstrumentais 
                        onSearchChange={handleSearchChange}
                        onSearchSubmit={() => console.log("Botão Ir pressionado")}
                    />
                    <TouchableOpacity
                        style={styles.iconStyle}
                        onPress={() => (navigation as any).navigate('NovoInstrumental')}
                    >
                        <Icon name="plus" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {isLoading && <Text>Carregando...</Text>}
                {error ? <Text>Erro ao carregar os istrumentais.</Text> : null}

                <ScrollView>
                    <View style={styles.table}>
                    <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.headerText, styles.cellNome]}>Nome</Text>
                    <Text style={[styles.headerText, styles.cellDescricao]}>Descrição</Text>
                    <Text style={[styles.headerText, styles.cellQuantidade]}>Quantidade Disponível</Text>
                    <Text style={[styles.headerText, styles.cellAcoes]}>Ações</Text>
                </View>
                        {filteredData.map(instr => (
                            
                            <View key={instr.id} style={styles.row}>
                                <Text style={styles.cellNome}>{instr.nome}</Text>
                                <Text style={styles.cellDescricao}>{instr.descricao}</Text>
                                <Text style={styles.cellQuantidade}>{instr.quantidadeDisponivel}</Text>
                                <AcoesBotoes 
                                    onEditarPress={() => (navigation as any).navigate('NovoInstrumental', { instrumentalId: instr.id })}
                                    onDeletarPress={() => handleDeletarInstrumental(instr.id)}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cabecalhoPadding: {
        paddingLeft: 50, // Ajuste esse valor conforme necessário para o cabeçalho
    },
    table: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    headerText: {
        fontWeight: 'bold',
    },
    cellNome: {
        flex: 3, // Ajuste conforme a necessidade para o nome do instrumental
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10, // Adiciona um pouco de espaço antes do texto
    },
    cellDescricao: {
        flex: 5, // Ajuste conforme a necessidade para a descrição do instrumental
        justifyContent: 'center',
        paddingLeft: 10, // Mantém o texto alinhado e legível
    },
    cellQuantidade: {
        flex: 2, // Ajuste conforme a necessidade para a quantidade disponível
        justifyContent: 'center',
        alignItems: 'center',
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
        marginRight: 10, // Assegura um espaço adequado entre os ícones
    },
    headerRow: {
        backgroundColor: '#f0f0f0', // Cor de fundo para o cabeçalho da tabela
    },
    cellAcoes: {
        flex: 2, // Ajuste conforme necessário para as ações
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    // Estilos adicionais podem ser necessários para outros elementos específicos não mencionados aqui
});



export default IndexInstrumental;

