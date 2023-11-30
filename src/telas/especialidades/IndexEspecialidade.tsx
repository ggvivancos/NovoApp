import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarEspecialidades from './componentes/SearchbarEspecialidades';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as EspecialidadeService from '../../services/EspecialidadeService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoEspecialidades from './componentes/CabecalhoEspecialidades';
import { scale, moderateScale } from 'react-native-size-matters';

type Especialidade = {
    id: number;
    nome: string;
    nomeabreviado: string;
    cor: string; // Adicionando a propriedade cor
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

    // Função para lidar com a exclusão de uma especialidade
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

    // Função para confirmar a exclusão de uma especialidade
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

    // Efeito para buscar e ordenar os dados ao focar no componente
    useFocusEffect(
        React.useCallback(() => {
            EspecialidadeService.obterTodasEspecialidades()
            .then(especialidadesResponse => {
                const especialidadesFetched = especialidadesResponse.data;
                // Ordenando os dados em ordem alfabética pelo nome
                const dadosOrdenados = especialidadesFetched.sort((a: Especialidade, b: Especialidade) => a.nome.localeCompare(b.nome));
                setEspecialidades(dadosOrdenados);
                setFilteredData(dadosOrdenados);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );

    // Função para lidar com mudanças na barra de pesquisa
    const handleSearchChange = (text: string) => {
        const newData = especialidades.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoEspecialidades />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarEspecialidades
                            placeholder="Buscar especialidade..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={scale(24)} 
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
                        <View style={styles.headerCor}><Text style={styles.headerText}>Cor</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(esp => (
                        <View key={esp.id} style={styles.row}>
                            <View style={styles.cellNomeCompleto}><Text>{esp.nome}</Text></View>
                            <View style={styles.cellNomeAbreviado}><Text>{esp.nomeabreviado}</Text></View>
                            <View style={[styles.cellCor, { backgroundColor: esp.cor }]}></View>
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
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 0,
    },
    cellCor: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 20,
        width: 10,
        borderRadius: 10,
        marginRight: 10,
        paddingRight: 40,
    },
    headerAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: moderateScale(10),
    },
});


export default IndexEspecialidade;

