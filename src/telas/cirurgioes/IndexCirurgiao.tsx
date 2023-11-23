import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import CabecalhoCirurgioes from './componentes/CabecalhoCirurgioes';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarCirurgioes from './componentes/SearchbarCirurgioes';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as CirurgiaoService from '../../services/CirurgiaoService';
import * as EspecialidadeService from '../../services/EspecialidadeService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import GenericFilter from '../../componentes/utilities/GenericFilter';
import Icon from 'react-native-vector-icons/FontAwesome';

type Especialidade = {
    id: number;
    nome: string;
    nomeabreviado: string;
    createdAt: string;
    updatedAt: string;
};

type Cirurgiao = {
    id: string;
    nome: string;
    nomeabreviado: string;
    especialidadeId: number;
    especialidade?: Especialidade;
};

const queryClient = new QueryClient();

const IndexCirurgioes = () => {
    const [cirurgioes, setCirurgioes] = useState<Cirurgiao[]>([]);
    const [filteredData, setFilteredData] = useState<Cirurgiao[]>([]);
    const [selectedEspecialidades, setSelectedEspecialidades] = useState<number[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'cirurgioes',
        ({ pageParam = 1 }) => CirurgiaoService.obterCirurgioes(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handleDeletarCirurgiao = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este cirurgião?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarCirurgiaoConfirmado(id) }
            ]
        );
    };

    const deletarCirurgiaoConfirmado = async (id: number) => {
        try {
            const response = await CirurgiaoService.deletarCirurgiao(id);
            if (response.ok) {
                const novosCirurgioes = cirurgioes.filter(cir => +cir.id !== id);
                setCirurgioes(novosCirurgioes);
                setFilteredData(novosCirurgioes);
                Alert.alert("Sucesso", "Cirurgião excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o cirurgião.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o cirurgião:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o cirurgião.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchCirurgioes = async () => {
                try {
                    const response = await CirurgiaoService.obterCirurgioes();
                    console.log('Cirurgiões fetched:', response);
    
                    if (response && Array.isArray(response.data)) {
                        const sortedCirurgioes = response.data.sort((a: Cirurgiao, b: Cirurgiao) => a.nome.localeCompare(b.nome));
    
                        // AQUI: Buscamos as especialidades e mapeamos os cirurgiões para suas especialidades
                        const especialidadesFetched = await EspecialidadeService.obterTodasEspecialidades();
                        if (especialidadesFetched && Array.isArray(especialidadesFetched.data)) {
                            setEspecialidades(especialidadesFetched.data);
                            const cirurgioesWithEspecialidadeInfo = sortedCirurgioes.map((cir: Cirurgiao) => {
                                const especialidade = especialidadesFetched.data.find((e: Especialidade) => e.id === cir.especialidadeId);
                                return {
                                    ...cir,
                                    nomeabreviadoEspecialidade: especialidade ? especialidade.nomeabreviado : 'N/A'
                                };
                            });
    
                            setCirurgioes(cirurgioesWithEspecialidadeInfo);
                            setFilteredData(cirurgioesWithEspecialidadeInfo);
                        } else {
                            console.error("A chave 'data' da resposta da API de especialidades não é um array:", especialidadesFetched);
                        }
                    } else {
                        console.error("A chave 'data' da resposta da API não é um array:", response);
                    }
                } catch (error) {
                    console.error('Erro ao buscar cirurgiões:', error);
                }
            };
    
            fetchCirurgioes();
        }, [])
    );
    
    

    const handleSearchChange = (text: string) => {
        const newData = cirurgioes.filter(item => {
            const itemData = item.nome.toUpperCase(); // Alterado para "nome"
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    const handleEspecialidadesChange = (especialidadesIds: number[]) => {
        setSelectedEspecialidades(especialidadesIds);
        if (especialidadesIds.length === 0) {
            setFilteredData(cirurgioes);
        } else {
            const newData = cirurgioes.filter(item => especialidadesIds.includes(item.especialidadeId));
            setFilteredData(newData);
        }
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoCirurgioes style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndFilterContainer}>
                        <SearchbarCirurgioes
                            placeholder="Buscar cirurgião..."
                            onSearchChange={handleSearchChange}
                        />
                        <View style={styles.iconsContainer}>
                            <Icon 
                                name="filter" 
                                size={24} 
                                color="#000" 
                                style={styles.iconStyle}
                                onPress={() => setIsFilterOpen(!isFilterOpen)}
                            />
                            <Icon 
                                name="plus" 
                                size={24} 
                                color="#000" 
                                style={styles.iconStyle}
                                onPress={() => (navigation as any).navigate('NovoCirurgiao')}
                            />
                        </View>
                    </View>
                    {isFilterOpen && (
                        <GenericFilter
                            items={especialidades}
                            selectedItems={selectedEspecialidades}
                            onItemsChange={handleEspecialidadesChange}
                            displayAttribute="nomeabreviado"
                        />
                    )}

                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os anestesistas.</Text> : null}

                    <View style={styles.tableHeader}>
                        <View style={styles.cellNomeCompleto}><Text style={styles.headerText}>Nome Completo</Text></View>
                        <View style={styles.cellNomeAbreviadoGrupo}><Text style={styles.headerText}>Nome Abreviado</Text></View>
                        <View style={styles.cellNomeAbreviadoGrupo}><Text style={styles.headerText}>Especialidade</Text></View>
                        <View style={styles.cellAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(cir => (
                        <View key={cir.id} style={styles.row}>
                            <View style={styles.cellNomeCompleto}><Text>{cir.nome}</Text></View>
                            <View style={styles.cellNomeAbreviadoGrupo}><Text>{cir.nomeabreviado}</Text></View>
                            <View style={styles.cellNomeAbreviadoGrupo}>
                            <Text>{cir.especialidade?.nomeabreviado ?? "Nenhum"}</Text>
                            </View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoCirurgiao', { cirurgiaoId: cir.id })}
                                onDeletarPress={() => handleDeletarCirurgiao(+cir.id)}
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
    table: {
        flex: 1,
        padding: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        backgroundColor: '#f7f7f7',
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
    cellNomeCompleto: {
        width: 150,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellNomeAbreviadoGrupo: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingRight: 15,
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
        marginLeft: 0,
    },
});

export default IndexCirurgioes;
