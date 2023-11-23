import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarEspecialidades from './componentes/SearchbarEspecialidades';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as EspecialidadeService from '../../services/EspecialidadeService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoEspecialidades from './componentes/CabecalhoEspecialidades';

type Especialidade = {
    id: number;
    nome: string;
    nomeabreviado: string;
    createdAt: string;
    updatedAt: string;
};

const queryClient = new QueryClient();

const IndexEspecialidade = () => {
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [filteredData, setFilteredData] = useState<Especialidade[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'especialidades',
        ({ pageParam = 1 }) => EspecialidadeService.obterEspecialidades(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handleDeletarEspecialidade = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir esta especialidade?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarEspecialidadeConfirmado(id) }
            ]
        );
    };

    const deletarEspecialidadeConfirmado = async (id: number) => {
        try {
            const response = await EspecialidadeService.deletarEspecialidade(id);
            if (response.ok) {
                const novasEspecialidades = especialidades.filter(esp => esp.id !== id);
                setEspecialidades(novasEspecialidades);
                setFilteredData(novasEspecialidades);
                Alert.alert("Sucesso", "Especialidade excluída com sucesso.");
            } else {
                throw new Error("Falha ao excluir a especialidade.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar a especialidade:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir a especialidade.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            EspecialidadeService.obterTodasEspecialidades()
            .then(especialidadesResponse => {
                const especialidadesFetched = especialidadesResponse.data;
                console.log("especialidadesFetched:", especialidadesFetched);
                setEspecialidades(especialidadesFetched);
                setFilteredData(especialidadesFetched);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );
    
    const handleSearchChange = (text: string) => {
        const newData = especialidades.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoEspecialidades style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarEspecialidades
                            placeholder="Buscar especialidade..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={24} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoEspecialidade')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar as especialidades.</Text> : null}
                    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerNomeCompleto}><Text style={styles.headerText}>Especialidade</Text></View>
                        <View style={styles.headerNomeAbreviado}><Text style={styles.headerText}>Abreviação</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                     </View>

                    {filteredData.map(esp => (
                        <View key={esp.id} style={styles.row}>
                            <View style={styles.cellNomeCompleto}><Text>{esp.nome}</Text></View>
                            <View style={styles.cellNomeAbreviado}><Text>{esp.nomeabreviado}</Text></View>
                            <AcoesBotoes
                                onEditarPress={() => (navigation as any).navigate('NovoEspecialidade', { especialidadeId: esp.id })}
                                onDeletarPress={() => handleDeletarEspecialidade(esp.id)}
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



export default IndexEspecialidade;
