import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarOPMEs from './componentes/SearchbarOPMEs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as OPMEService from '../../services/OPMEService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoOPMEs from './componentes/CabecalhoOPMEs';
import { scale, moderateScale } from 'react-native-size-matters';

type Fornecedor = {
    id: number;
    nome: string;
};

type OPME = {
    id: number;
    nome: string;
    fornecedores: Fornecedor[]; // Atualizado para usar o tipo Fornecedor
};

const queryClient = new QueryClient();

const IndexOPME = () => {
    const [opmes, setOPMEs] = useState<OPME[]>([]);
    const [filteredData, setFilteredData] = useState<OPME[]>([]);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'opmes',
        ({ pageParam = 1 }) => OPMEService.obterOPMEs(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handleDeletarOPME = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir esta OPME?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarOPMEConfirmado(id) }
            ]
        );
    };

    const deletarOPMEConfirmado = async (id: number) => {
        try {
            const response = await OPMEService.deletarOPME(id);
            if (response.ok) {
                const novasOPMEs = opmes.filter(opme => opme.id !== id);
                setOPMEs(novasOPMEs);
                setFilteredData(novasOPMEs);
                Alert.alert("Sucesso", "OPME excluída com sucesso.");
            } else {
                throw new Error("Falha ao excluir a OPME.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar a OPME:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir a OPME.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            OPMEService.obterTodasOPMEs()
            .then(opmesResponse => {
                console.log("Dados retornados do serviço:", opmesResponse);
                if (opmesResponse && opmesResponse.data) {
                    const dadosOrdenados = opmesResponse.data.sort((a: OPME, b: OPME) => a.nome.localeCompare(b.nome));
                    setOPMEs(dadosOrdenados);
                    setFilteredData(dadosOrdenados);
                } else {
                    console.error("Erro: Dados não retornados do serviço.");
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );

    const handleSearchChange = (text: string) => {
        const newData = opmes.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

        // Continuação do componente IndexOPME
        return (
            <GlobalLayout showBackButton={true} headerComponent={<CabecalhoOPMEs />}>
                <QueryClientProvider client={queryClient}>
                    <ScrollView style={styles.container}>
                        <View style={styles.searchAndIconContainer}>
                            <SearchbarOPMEs
                                placeholder="Buscar OPME..."
                                onSearchChange={handleSearchChange}
                            />
                            <Icon 
                                name="plus" 
                                size={scale(24)} 
                                color="#000"
                                style={styles.iconStyle}
                                onPress={() => (navigation as any).navigate('NovoOPME')}
                            />
                        </View>
                        {isLoading && <Text>Carregando...</Text>}
                        {error ? <Text>Erro ao carregar as OPMEs.</Text> : null}
                        
                        <View style={styles.tableHeader}>
                            <View style={styles.headerNome}><Text style={styles.headerText}>Nome</Text></View>
                            <View style={styles.headerFornecedores}><Text style={styles.headerText}>Fornecedores</Text></View>
                            <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                        </View>
    
                        {filteredData.map(opme => (
    <View key={opme.id} style={styles.row}>
        <View style={styles.cellNome}><Text>{opme.nome}</Text></View>
        <View style={styles.cellFornecedores}>
            <Text>
                {Array.isArray(opme.fornecedores) && opme.fornecedores.length > 0
                    ? opme.fornecedores.map(f => f.nome).join(', ')
                    : 'Nenhum fornecedor'}
            </Text>
        </View>
        <AcoesBotoes
            onEditarPress={() => (navigation as any).navigate('NovoOPME', { opmeId: opme.id })}
            onDeletarPress={() => handleDeletarOPME(opme.id)}
        />
    </View>
))}
    
                        <Paginacao
                            currentPage={data?.pages[data?.pages.length - 1]?.meta.currentPage || 1}
                            totalPages={data?.pages[data?.pages.length - 1]?.meta.totalPages || 1}
                            onPageChange={(page: number) => fetchNextPage({ pageParam: page })}
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
        headerNome: {
            flex: 3,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: moderateScale(10),
        },
        headerFornecedores: {
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: moderateScale(10),
        },
        cellNome: {
            flex: 3,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: 0,
        },
        cellFornecedores: {
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: 0,
        },
        headerAcoes: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: moderateScale(10),
        },
    });
    
    export default IndexOPME;
    
