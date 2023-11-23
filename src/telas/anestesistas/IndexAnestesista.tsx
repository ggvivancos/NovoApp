import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import CabecalhoAnestesistas from './componentes/CabecalhoAnestesistas';
import GlobalLayout from '../../layouts/GlobalLayout';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchbarAnestesistas from './componentes/SearchbarAnestesistas';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes'; 
import * as AnestesistaService from '../../services/AnestesistaService';
import * as GrupoDeAnestesiaService from '../../services/GrupoDeAnestesiaService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao, { PaginacaoProps } from '../../componentes/paginacao/Paginacao';
import GenericFilter from '../../componentes/utilities/GenericFilter';



type Anestesista = {
    id: string;
    nomecompleto: string;
    nomeabreviado: string;
    iniciais: string;
    grupodeanestesiaId: number;
    nomeabreviadoGrupo?: string;
};

type GrupoDeAnestesia = {
    id: number;
    nome: string;
    nomeabreviado: string;
    createdAt: string;
    updatedAt: string;
};


const queryClient = new QueryClient();


const IndexAnestesista = () => {
    const [anestesistas, setAnestesistas] = useState<Anestesista[]>([]);
    const [filteredData, setFilteredData] = useState<Anestesista[]>([]);
    const [selectedGrupos, setSelectedGrupos] = useState<number[]>([]);
    const [grupos, setGrupos] = useState<GrupoDeAnestesia[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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
        'anestesistas',
        ({ pageParam = 1 }) => AnestesistaService.obterAnestesistas(25, pageParam), // Altere aqui para chamar diretamente seu serviço
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handlePageChange = async (newPage: number) => {
        console.log("handlePageChange -> newPage:", newPage);
        setCurrentPageState(newPage);
    
        try {
            const response = await AnestesistaService.obterAnestesistas(25, newPage); 
            if(response && Array.isArray(response.data)) {
                const sortedData = response.data.sort((a: Anestesista, b: Anestesista) => a.nomecompleto.localeCompare(b.nomecompleto));
                
                // Chame a função para mapear os anestesistas para seus grupos
                await mapAnestesistasToGrupos(sortedData);
            } else {
                console.error("A resposta da API não é um array ou está indefinida:", response);
            }
        } catch (error) {
            console.error("Erro ao buscar dados da página:", newPage, error);
            // Aqui você pode adicionar um estado para gerenciar mensagens de erro na UI se desejar.
        }
    };
    
    
    
   
    const handleDeletarAnestesista = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este anestesista?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarAnestesistaConfirmado(id) }
            ]
        );
    };
    
    const deletarAnestesistaConfirmado = async (id: number) => {
        try {
            const response = await AnestesistaService.deletarAnestesista(id);
            if (response.ok) {
                // Remova o anestesista excluído da lista local
                const novosAnestesistas = anestesistas.filter(anest => +anest.id !== id);
                setAnestesistas(novosAnestesistas);
                setFilteredData(novosAnestesistas); // <-- Adicione esta linha
                Alert.alert("Sucesso", "Anestesista excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o anestesista.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o anestesista:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o anestesista.");
        }
    }
    
        
    useFocusEffect(
        React.useCallback(() => {
            const fetchAnestesistas = async () => {
                try {
                    const response = await AnestesistaService.obterAnestesistas();
                    console.log('Anestesistas fetched:', response);
    
                    if (response && Array.isArray(response.data)) {
                        const sortedAnestesistas = response.data.sort((a: Anestesista, b: Anestesista) => a.nomecompleto.localeCompare(b.nomecompleto));
    
                        // AQUI: Buscamos os grupos de anestesia e mapeamos os anestesistas para seus grupos
                        const gruposFetched = await GrupoDeAnestesiaService.obterTodosGruposDeAnestesia();
                        if (gruposFetched && Array.isArray(gruposFetched.data)) {
                            setGrupos(gruposFetched.data);
                            const anestesistasWithGroupInfo = sortedAnestesistas.map((anest: Anestesista) => {
                                const grupo = gruposFetched.data.find((g: GrupoDeAnestesia) => g.id === anest.grupodeanestesiaId);
                                return {
                                    ...anest,
                                    nomeabreviadoGrupo: grupo ? grupo.nomeabreviado : 'Nenhum'
                                };
                            });
    
                            setAnestesistas(anestesistasWithGroupInfo);
                            setFilteredData(anestesistasWithGroupInfo);
                        } else {
                            console.error("A chave 'data' da resposta da API de grupos não é um array:", gruposFetched);
                        }
    
                    } else {
                        console.error("A chave 'data' da resposta da API não é um array:", response);
                    }
                } catch (error) {
                    console.error('Erro ao buscar anestesistas:', error);
                }
            };
    
            fetchAnestesistas();
        }, [])
    );
    
    
    const mapAnestesistasToGrupos = async (anestesistasData: Anestesista[]) => {
        const gruposFetched = await GrupoDeAnestesiaService.obterTodosGruposDeAnestesia();
        if (gruposFetched && Array.isArray(gruposFetched.data)) {
            setGrupos(gruposFetched.data);
            const anestesistasWithGroupInfo = anestesistasData.map((anest: Anestesista) => {
                const grupo = gruposFetched.data.find((g: GrupoDeAnestesia) => g.id === anest.grupodeanestesiaId);
                return {
                    ...anest,
                    nomeabreviadoGrupo: grupo ? grupo.nomeabreviado : 'Nenhum'
                };
            });
    
            setAnestesistas(anestesistasWithGroupInfo);
            setFilteredData(anestesistasWithGroupInfo);
        } else {
            console.error("A chave 'data' da resposta da API de grupos não é um array:", gruposFetched);
        }
    };
    

    const handleSearchChange = (text: string) => {
        const newData = anestesistas.filter(item => {
            const itemData = item.nomecompleto ? item.nomecompleto.toUpperCase() : '';
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    const handleGrupoChange = (gruposIds: number[]) => {
        setSelectedGrupos(gruposIds);
        if (gruposIds.length === 0) {
            setFilteredData(anestesistas);
        } else {
            const newData = anestesistas.filter(item => gruposIds.includes(item.grupodeanestesiaId));
            setFilteredData(newData);
        }
    };
    
    

    
    

    return (
        
            <GlobalLayout showBackButton={true} headerComponent={<CabecalhoAnestesistas style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <View style={styles.searchAndFilterContainer}>
                    <SearchbarAnestesistas 
                        onSearchChange={handleSearchChange}
                        onSearchSubmit={() => console.log("Botão Ir pressionado")}
                    />
                    <View style={styles.iconsContainer}>
                        <Icon 
                            name="filter" 
                            size={24} 
                            color="#000" 
                            style={styles.iconStyle}
                            onPress={() => setIsFilterOpen(!isFilterOpen)}
                        />
                        <View style={styles.iconsContainer} />
                        <Icon 
                            name="plus" 
                            size={24} 
                            color="#000" 
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoAnestesista')}
                        />
                    </View>
                </View>
                {isFilterOpen && (
                    <GenericFilter 
                    items={grupos}
                    selectedItems={selectedGrupos}
                    onItemsChange={handleGrupoChange}
                    displayAttribute="nomeabreviado"
                />
                
                )}

            {isLoading && <Text>Carregando...</Text>}
            {error ? <Text>Erro ao carregar os anestesistas.</Text> : null}


                <ScrollView>
    <View style={styles.table}>
        <View style={styles.row}>
            <View style={styles.cellNomeCompleto}><Text style={styles.headerText}>Nome</Text></View>
            <View style={styles.cellNomeAbreviadoGrupo}><Text style={styles.headerText}>Abreviado</Text></View>
            <View style={styles.cellIniciaisAcoes}><Text style={styles.headerText}>Iniciais</Text></View>
            <View style={styles.cellNomeAbreviadoGrupo}><Text style={styles.headerText}>Grupo</Text></View>
            <View style={styles.cellAcoes}><Text style={styles.headerText}>Ações</Text></View>
        
        
        </View>                     

        {filteredData.map(anest => (
    <View key={anest.id} style={styles.row}>
        <View style={styles.cellNomeCompleto}><Text>{anest.nomecompleto}</Text></View>
        <View style={styles.cellNomeAbreviadoGrupo}><Text>{anest.nomeabreviado}</Text></View>
        <View style={styles.cellIniciaisAcoes}><Text>{anest.iniciais}</Text></View>
        <View style={styles.cellNomeAbreviadoGrupo}>
            <Text>{anest.nomeabreviadoGrupo ? anest.nomeabreviadoGrupo : "Nenhum"}</Text>
        </View>
        <AcoesBotoes 
    onEditarPress={() => (navigation as any).navigate('NovoAnestesista', { anestesistaId: anest.id })}
    onDeletarPress={() => handleDeletarAnestesista(+anest.id)}
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
        paddingLeft: 50, // Ajuste esse valor conforme necessário
    },
    table: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 0,
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
    cellIniciaisAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 20,
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

export default IndexAnestesista;




