import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import CabecalhoHospital from './componentes/CabecalhoHospital'; 
import GlobalLayout from '../../layouts/GlobalLayout';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchbarHospital from './componentes/SearchbarHospital'; 
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes'; 
import * as HospitalService from '../../services/HospitalService'; 
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao, { PaginacaoProps } from '../../componentes/paginacao/Paginacao';
import GenericFilter from '../../componentes/utilities/GenericFilter';

type Hospital = {
    id: string;
    nome: string;
    cor: string;
    nomeabreviado: string | null; // Adicionado
};


const queryClient = new QueryClient();

const IndexHospital = () => {
    const [hospitais, setHospitais] = useState<Hospital[]>([]);
    const [filteredData, setFilteredData] = useState<Hospital[]>([]);
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
        'hospitais',
        ({ pageParam = 1 }) => HospitalService.obterHospitais(25, pageParam),
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
            const response = await HospitalService.obterHospitais(25, newPage); 
            if(response && Array.isArray(response.data)) {
                const sortedData = response.data.sort((a: Hospital, b: Hospital) => a.nome.localeCompare(b.nome));
                setHospitais(sortedData);
                setFilteredData(sortedData);
            } else {
                console.error("A resposta da API não é um array ou está indefinida:", response);
            }
        } catch (error) {
            console.error("Erro ao buscar dados da página:", newPage, error);
        }
    };

    const handleDeletarHospital = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este hospital?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarHospitalConfirmado(id) }
            ]
        );
    };

    const deletarHospitalConfirmado = async (id: number) => {
        try {
            const response = await HospitalService.deletarHospital(id);
            if (response.ok) {
                const novosHospitais = hospitais.filter(hospital => hospital.id !== id.toString());
                setHospitais(novosHospitais);
                setFilteredData(novosHospitais);
                Alert.alert("Sucesso", "Hospital excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o hospital.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o hospital:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o hospital.");
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchHospitais = async () => {
                try {
                    const response = await HospitalService.obterHospitais();
                    console.log('Hospitais fetched:', response);

                    if (response && Array.isArray(response.data)) {
                        const sortedHospitais = response.data.sort((a: Hospital, b: Hospital) => a.nome.localeCompare(b.nome));
                        setHospitais(sortedHospitais);
                        setFilteredData(sortedHospitais);
                    } else {
                        console.error("A chave 'data' da resposta da API não é um array:", response);
                    }
                } catch (error) {
                    console.error('Erro ao buscar hospitais:', error);
                }
            };

            fetchHospitais();
        }, [])
    );

    const handleSearchChange = (text: string) => {
        const newData = hospitais.filter(item => {
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

    const handleSetoresSalasClick = (hospitalId: string) => {
        navigation.navigate('IndexSetorESala' as any, { hospitalId });


    };
    
    


    function setIsFilterOpen(arg0: boolean): void {
        throw new Error('Function not implemented.');
    }

return (
    <GlobalLayout showBackButton={true} headerComponent={<CabecalhoHospital style={styles.cabecalhoPadding} />}>
        <QueryClientProvider client={queryClient}>
            <View style={styles.searchAndFilterContainer}>
                <SearchbarHospital 
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={() => console.log("Botão Ir pressionado")}
                />
                    <View style={styles.iconsContainer} />
                    <Icon 
                        name="plus" 
                        size={24} 
                        color="#000" 
                        style={styles.iconStyle}
                        onPress={() => (navigation as any).navigate('NovoHospital')}
                    />
                
            </View>
            {isLoading && <Text>Carregando...</Text>}
            {error ? <Text>Erro ao carregar os hospitais.</Text> : null}

            <ScrollView>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={styles.cellNome}><Text style={styles.headerText}>Nome</Text></View>
                        <View style={styles.cellNomeAbreviado}><Text style={styles.headerText}>Nome Abreviado</Text></View>
                        <View style={styles.cellCor}><Text style={styles.headerText}>Cor</Text></View>
                        <View style={styles.cellSetoresSalas}><Text style={styles.headerText}>Setores/Salas</Text></View>
                        <View style={styles.cellAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>                     

                    {filteredData.map(hospital => (
    <View key={hospital.id} style={styles.row}>
        <View style={styles.cellNome}><Text>{hospital.nome}</Text></View>
        <View style={styles.cellNomeAbreviado}><Text>{hospital.nomeabreviado}</Text></View>
        <View style={[styles.cellCor, { backgroundColor: hospital.cor }]}></View>
        <View style={styles.cellSetoresSalas}>
            <Icon 
                name="edit" 
                size={24} 
                color="#000" 
                onPress={() => handleSetoresSalasClick(hospital.id)}
            />
        </View>
        <AcoesBotoes 
            onEditarPress={() => (navigation as any).navigate('NovoHospital', { hospitalId: hospital.id })}
            onDeletarPress={() => handleDeletarHospital(Number(hospital.id))}
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
    cellEndereco: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 0,
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
    cellNomeAbreviado: {
        flex: 1.0, // Alocando menos espaço que cellNome, mas mais do que cellAcoes
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
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
    cellSetoresSalas: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
});


export default IndexHospital
