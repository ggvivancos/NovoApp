import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarAgendamentos from './componentes/SearchbarAgendamentos';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import * as AgendamentoService from '../../services/AgendamentoService';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoAgendamentos from './componentes/CabecalhoAgendamentos';

type Agendamento = {
    id: number;
    datadacirurgia: string;
    horainicio: string;
    duracaoEstimada: string;
    status: string;
    uti: boolean;
    apa: boolean;
    leito: string;
    observacao: string;
    aviso: string;
    prontuario: string;
    lateralidade: string;
    pacote: boolean;
    isDeleted: boolean;
    Paciente: {
        nomecompleto: string;
    };
    Anestesistum: {
        nomecompleto: string;
    } | null;
    Hospital: {
        nome: string;
    };
    Setor: {
        nome: string;
    } | null;
    SalaDeCirurgium: {
        nome: string;
    } | null;
    Procedimentos: {
        nome: string;
    }[];
    Cirurgiaos: {
        nomecompleto: string;
    }[];
    // Adicione outros relacionamentos conforme necessário
};




const queryClient = new QueryClient();

const IndexAgendamento = () => {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [filteredData, setFilteredData] = useState<Agendamento[]>([]);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const navigation = useNavigation();

    // Funções para buscar os dados dos agendamentos
    const buscarAgendamentos = async () => {
        try {
            const response = await AgendamentoService.obterTodosAgendamentos(); // Substitua com a chamada correta ao seu serviço
            setAgendamentos(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    };

    // Função para formatar a data
    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    // Função para lidar com a exclusão de um agendamento
    const handleDeletarAgendamento = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este agendamento?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarAgendamentoConfirmado(id) }
            ]
        );
    };

    const deletarAgendamentoConfirmado = async (id: number) => {
        try {
            await AgendamentoService.deletarAgendamento(id); // Substitua com a chamada correta ao seu serviço
            const novosAgendamentos = agendamentos.filter(agendamento => agendamento.id !== id);
            setAgendamentos(novosAgendamentos);
            setFilteredData(novosAgendamentos);
            Alert.alert("Sucesso", "Agendamento excluído com sucesso.");
        } catch (erro) {
            console.error("Erro ao deletar o agendamento:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o agendamento.");
        }
    };

    // Função para lidar com a pesquisa de agendamentos
    const handleSearchChange = (text: string) => {
        const newData = agendamentos.filter(item => {
            const itemData = `${item.Paciente.nomecompleto.toUpperCase()} ${item.Procedimentos.map(p => p.nome).join(' ').toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    // Função para alternar a expansão da linha
    const toggleRowExpansion = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    // Renderização da linha expandida
    const renderExpandedRow = (agendamento: Agendamento) => (
        <View style={styles.expandedRow}>
            {/* Adicione aqui a renderização de campos adicionais do agendamento */}
            <Text style={styles.expandedText}>Hora de Início: {agendamento.horainicio}</Text>
            {/* Adicione mais campos conforme necessário */}
        </View>
    );

    // Efeito para buscar agendamentos quando o componente é focado
    useFocusEffect(
        React.useCallback(() => {
            buscarAgendamentos();
        }, [])
    );

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoAgendamentos style={styles.cabecalhoPadding} />}>
            <QueryClientProvider client={queryClient}>
                <ScrollView style={styles.container}>
                    <View style={styles.searchAndIconContainer}>
                        <SearchbarAgendamentos
                            placeholder="Buscar agendamento..."
                            onSearchChange={handleSearchChange}
                        />
                        <Icon 
                            name="plus" 
                            size={24} 
                            color="#000"
                            style={styles.iconStyle}
                            onPress={() => (navigation as any).navigate('NovoAgendamento')}
                        />
                    </View>
                    {/* Renderização da lista de agendamentos */}
                    <View style={styles.tableHeader}>
                        <View style={styles.headerData}><Text style={styles.headerText}>Data</Text></View>
                        <View style={styles.headerHora}><Text style={styles.headerText}>Hora</Text></View>
                        <View style={styles.headerPaciente}><Text style={styles.headerText}>Paciente</Text></View>
                        <View style={styles.headerProcedimento}><Text style={styles.headerText}>Procedimento</Text></View>
                        <View style={styles.headerCirurgiao}><Text style={styles.headerText}>Cirurgião</Text></View>
                        <View style={styles.headerAcoes}><Text style={styles.headerText}>Ações</Text></View>
                    </View>

                    {filteredData.map(agendamento => (
    <React.Fragment key={agendamento.id}>
        <TouchableOpacity style={styles.row} onPress={() => toggleRowExpansion(agendamento.id)}>
            <View style={styles.cellData}><Text>{formatarData(agendamento.datadacirurgia)}</Text></View>
            <View style={styles.cellHora}><Text>{agendamento.horainicio}</Text></View>
            <View style={styles.cellPaciente}><Text>{agendamento.Paciente.nomecompleto}</Text></View>
            <View style={styles.cellProcedimento}><Text>{agendamento.Procedimentos.map(p => p.nome).join(', ')}</Text></View>
            <View style={styles.cellCirurgiao}><Text>{agendamento.Cirurgiaos.map(c => c.nomecompleto).join(', ')}</Text></View>
                                <AcoesBotoes
                                    onEditarPress={() => (navigation as any).navigate('EditarAgendamento', { agendamentoId: agendamento.id })}
                                    onDeletarPress={() => handleDeletarAgendamento(agendamento.id)}
                                />
                            </TouchableOpacity>
                            {expandedRowId === agendamento.id && renderExpandedRow(agendamento)}
                        </React.Fragment>
                    ))}

                    {/* Componente de Paginação */}
                    <Paginacao
                        currentPage={1} // Substitua com a lógica de paginação correta
                        totalPages={10} // Substitua com a lógica de paginação correta
                        onPageChange={(page: number) => {/* Implemente a lógica de mudança de página aqui */}}
                    />
                </ScrollView>
            </QueryClientProvider>
        </GlobalLayout>
    );
};

// Estilos
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
    headerData: {
        flex: 2,
    },
    headerHora: {
        flex: 1,
    },
    headerPaciente: {
        flex: 2,
    },
    headerProcedimento: {
        flex: 2,
    },
    headerCirurgiao: {
        flex: 2,
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
    cellData: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellHora: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellPaciente: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellProcedimento: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    cellCirurgiao: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,
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
    // Adicione aqui mais estilos conforme necessário
});

export default IndexAgendamento;
