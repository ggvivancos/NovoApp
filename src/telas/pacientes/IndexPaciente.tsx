import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarPacientes from './componentes/SearchbarPacientes';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as PacienteService from '../../services/PacienteService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoPacientes from './componentes/CabecalhoPacientes';
import { Paciente } from '../../types/types';


const queryClient = new QueryClient();

const IndexPaciente = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [filteredData, setFilteredData] = useState<Paciente[]>([]);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'pacientes',
        ({ pageParam = 1 }) => PacienteService.obterPacientes(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );
    
    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0!
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const handleDeletarPaciente = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este paciente?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarPacienteConfirmado(id) }
            ]
        );
    };

    const deletarPacienteConfirmado = async (id: number) => {
        try {
            const response = await PacienteService.deletarPaciente(id);
            if (response.ok) {
                const novosPacientes = pacientes.filter(paciente => paciente.id !== id);
                setPacientes(novosPacientes);
                setFilteredData(novosPacientes);
                Alert.alert("Sucesso", "Paciente excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o paciente.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o paciente:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o paciente.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            PacienteService.obterTodosPacientes()
            .then(pacientesResponse => {
                const pacientesFetched = pacientesResponse.data;
                setPacientes(pacientesFetched);
                setFilteredData(pacientesFetched);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
        }, [])
    );

    const handleSearchChange = (text: string) => {
        const newData = pacientes.filter(item => {
            const itemData = item.nomecompleto.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    const toggleRowExpansion = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    const renderExpandedRow = (paciente: Paciente) => (
        <View style={styles.expandedRow}>
            <Text style={styles.expandedText}>Idade: {paciente.idade}</Text>
            <Text style={styles.expandedText}>VAD: {paciente.VAD ? 'Sim' : 'Não'}</Text>
            <Text style={styles.expandedText}>Alergia: {paciente.alergia ? 'Sim' : 'Não'}</Text>
            <Text style={styles.expandedText}>Alergia a Látex: {paciente.alergiaLatex ? 'Sim' : 'Não'}</Text>
            <Text style={styles.expandedText}>Prontuário: {paciente.prontuario}</Text>
            <Text style={styles.expandedText}>CPF: {paciente.CPF}</Text>
            <Text style={styles.expandedText}>RG: {paciente.RG}</Text>
            <Text style={styles.expandedText}>Telefone: {paciente.telefone}</Text>
            <Text style={styles.expandedText}>Observação: {paciente.observacao}</Text>
        </View>
    );

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoPacientes style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarPacientes
                            placeholder="Buscar paciente..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={24} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoPaciente')}
                        />
                    </View>
                    {isLoading && <Text>Carregando...</Text>}
                    {error ? <Text>Erro ao carregar os pacientes.</Text> : null}
                    
                    <View style={styles.tableHeader}>
                        <View style={styles.headerNome}><Text style={styles.headerText}>Nome</Text></View>
                        <View style={styles.headerDataNascimento}><Text style={styles.headerText}>Data de Nascimento</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(paciente => (
    <React.Fragment key={paciente.id}>
        <TouchableOpacity style={styles.row} onPress={() => toggleRowExpansion(paciente.id)}>
            <View style={styles.cellNome}><Text>{paciente.nomecompleto}</Text></View>
            <View style={styles.cellDataNascimento}><Text>{formatarData(paciente.datadenascimento)}</Text></View>
            <AcoesBotoes
                onEditarPress={() => (navigation as any).navigate('NovoPaciente', { pacienteId: paciente.id })}
                onDeletarPress={() => handleDeletarPaciente(paciente.id)}
            />
        </TouchableOpacity>
        {expandedRowId === paciente.id && renderExpandedRow(paciente)}
    </React.Fragment>
))}


                    <Paginacao
                        currentPage={data?.pages.length || 1}
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
    headerNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    headerDataNascimento: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    headerAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        paddingLeft: 20,
    },
    cellNome: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellDataNascimento: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedRow: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    expandedText: {
        fontSize: 12,
        color: '#333',
        marginBottom: 5,
    },
});


export default IndexPaciente;
