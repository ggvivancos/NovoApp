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



type StatusAgendamento = {
    nome: string;
    cor: string;
};

type Agendamento = {
    id: number;
    datadacirurgia: string;
    horainicio: string;
    duracaoEstimada: string;
    status: StatusAgendamento;
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
        datadenascimento: string; // Novo campo
        observacao: string; // Novo campo
        VAD: boolean; // Novo campo
        alergia: boolean; // Novo campo
        alergialatex: boolean; // Novo campo
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
        nome: string;
    }[];
    // Adicione outros relacionamentos conforme necessário
};




const queryClient = new QueryClient();

const IndexAgendamento = () => {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [filteredData, setFilteredData] = useState<Agendamento[]>([]);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const navigation = useNavigation();
    const [currentPageState, setCurrentPageState] = useState<number>(1);
    const formatarHoraInicio = (horaString: string) => {
        // Supõe que a string está no formato 'HH:MM:SS'
        const partes = horaString.split(':');
        if (partes.length >= 2) {
            // Retorna apenas as horas e minutos
            return `${partes[0]}:${partes[1]}`;
        } else {
            // Retorna a string original se não estiver no formato esperado
            return horaString;
        }
    };
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'agendamentos',
        ({ pageParam = 1 }) => AgendamentoService.obterAgendamentos(25, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );

    const handlePageChange = async (newPage: number) => {
        setCurrentPageState(newPage);
        try {
            const response = await AgendamentoService.obterAgendamentos(25, newPage);
            if (response && Array.isArray(response.data)) {
                setAgendamentos(response.data);
                setFilteredData(response.data);
            } else {
                console.error("A resposta da API não é um array ou está indefinida:", response);
            }
        } catch (error) {
            console.error("Erro ao buscar dados da página:", newPage, error);
        }
    };

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

    const renderExpandedRow = (agendamento: Agendamento) => (
        <View style={styles.expandedRow}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* Coluna Esquerda */}
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.expandedText}>Data de Nascimento do Paciente: {formatarData(agendamento.Paciente.datadenascimento)}</Text>
                    <Text style={styles.expandedText}>Observação do Paciente: {agendamento.Paciente.observacao}</Text>
                    <Text style={styles.expandedText}>VAD: {agendamento.Paciente.VAD ? 'Sim' : 'Não'}</Text>
                    <Text style={styles.expandedText}>Alergia: {agendamento.Paciente.alergia ? 'Sim' : 'Não'}</Text>
                    <Text style={styles.expandedText}>Alergia a Látex: {agendamento.Paciente.alergialatex ? 'Sim' : 'Não'}</Text>
                    <Text style={styles.expandedText}>UTI: {agendamento.uti ? 'Sim' : 'Não'}</Text>
                    <Text style={styles.expandedText}>APA: {agendamento.apa ? 'Sim' : 'Não'}</Text>
                    <Text style={styles.expandedText}>Leito: {agendamento.leito}</Text>
                </View>
    
                {/* Coluna Direita */}
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={styles.expandedText}>Observação: {agendamento.observacao}</Text>
                    <Text style={styles.expandedText}>Aviso: {agendamento.aviso}</Text>
                    <Text style={styles.expandedText}>Prontuário: {agendamento.prontuario}</Text>
                    <Text style={styles.expandedText}>Lateralidade: {agendamento.lateralidade}</Text>
                    <Text style={styles.expandedText}>Pacote: {agendamento.pacote ? 'Sim' : 'Não'}</Text>
                    <Text style={styles.expandedText}>Anestesista: {agendamento.Anestesistum ? agendamento.Anestesistum.nomecompleto : 'Não informado'}</Text>
                    <Text style={styles.expandedText}>Hospital: {agendamento.Hospital.nome}</Text>
                    <Text style={styles.expandedText}>Setor: {agendamento.Setor ? agendamento.Setor.nome : 'Não informado'}</Text>
                    <Text style={styles.expandedText}>Sala de Cirurgia: {agendamento.SalaDeCirurgium ? agendamento.SalaDeCirurgium.nome : 'Não informado'}</Text>
                </View>
            </View>
        </View>
    );
    

    // Efeito para buscar agendamentos quando o componente é focado
    useFocusEffect(
        React.useCallback(() => {
            handlePageChange(1);
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
                        <View style={styles.headerStatus}><Text style={styles.headerText}>Status</Text></View>
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
            <View style={styles.cellStatus}>
                <View style={[styles.statusCircle, { backgroundColor: agendamento.status ? agendamento.status.cor : 'grey' }]} />
                <Text style={styles.statusText}>
                    {agendamento.status ? agendamento.status.nome : 'Indefinido'}
                </Text>
            </View>
            <View style={styles.cellData}><Text>{formatarData(agendamento.datadacirurgia)}</Text></View>
            <View style={styles.cellHora}><Text>{formatarHoraInicio(agendamento.horainicio)}</Text></View>
            <View style={styles.cellPaciente}><Text>{agendamento.Paciente.nomecompleto}</Text></View>
            <View style={styles.cellProcedimento}><Text>{agendamento.Procedimentos.map(p => p.nome).join(', ')}</Text></View>
            <View style={styles.cellCirurgiao}>
    <Text>
        {agendamento.Cirurgiaos.length > 0 
            ? agendamento.Cirurgiaos.map(c => c.nome).join(', ') 
            : 'Não informado'}
    </Text>
</View>
            <AcoesBotoes
        onEditarPress={() => (navigation as any).navigate('NovoAgendamento', { agendamentoId: agendamento.id })}
         onDeletarPress={() => handleDeletarAgendamento(agendamento.id)}
            />
        </TouchableOpacity>
        {expandedRowId === agendamento.id && renderExpandedRow(agendamento)}
    </React.Fragment>
))}


                <Paginacao
                    currentPage={currentPageState}
                    totalPages={data?.pages[data?.pages.length - 1]?.meta.totalPages || 1}
                    onPageChange={handlePageChange}
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
    headerStatus: {
        flex: 1, // Metade da largura de 'Data'
    },
    headerData: {
        flex: 2,
    },
    headerHora: {
        flex: 0.75, // Mais estreita
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
    cellStatus: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    statusCircle: {
        width: 15,
        height: 15,
        borderRadius: 15 / 2,
        marginBottom: 5,
    },
    statusText: {
        fontSize: 10,
        textAlign: 'center',
    },

    cellData: {
        flex: 2,
    },
    cellHora: {
        flex: 0.75, // Mais estreita
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
