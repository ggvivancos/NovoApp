import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import * as AgendamentoService from '../../services/AgendamentoService'; // Importe seu serviço de Agendamento
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import GenericFilter from '../../componentes/utilities/GenericFilter';
import SearchbarAgendamentos from './componentes/SearchbarAgendamentos';
import CabecalhoAgendamentos from './componentes/CabecalhoAgendamentos';
//import { AgendamentoData } from '../../services/AgendamentoService';
import GlobalLayout from '../../layouts/GlobalLayout';
import { AgendamentoData, DadosAgendamentoApi } from '../../types'; // Ajuste o caminho conforme necessário
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import StatusIndicator from '../../componentes/utilities/StatusIndicator';



const queryClient = new QueryClient();

const IndexAgendamento = () => {
    const [agendamentos, setAgendamentos] = useState<AgendamentoData[]>([]);
    const [filteredData, setFilteredData] = useState<AgendamentoData[]>([]);
    const navigation = useNavigation();
    const [currentPageState, setCurrentPageState] = useState<number>(1);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);


    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery(
        'agendamentos',
        ({ pageParam = 1 }) => AgendamentoService.obterAgendamentosDetalhados(25, pageParam), // Utilize seu serviço para obter agendamentos
        {
            getNextPageParam: (lastPage, pages) => {
                return lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : false;
            }
        }
    );


    const formatarData = (dataString: string | number | Date) => {
        const data = new Date(dataString);
        return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
    };
    
    const formatarHora = (horaString: string) => {
        const [hora, minuto] = horaString.split(':');
        return `${hora}:${minuto}`;
    };

    const formatarDuracao = (duracaoString: string) => {
        const [hora, minuto] = duracaoString.split(':');
        return `${hora}:${minuto}`;
    };

      
        
    const mapearDadosAgendamento = (dados: DadosAgendamentoApi[]): AgendamentoData[] => {
        return dados.map(agendamento => {
            return {
                id: agendamento.id,
                datadacirurgia: formatarData(agendamento.datadacirurgia),
                horainicio: formatarHora(agendamento.horainicio),
                duracao: formatarDuracao(agendamento.duracao),
                hospitalId: agendamento.Hospital?.id || 0,
                hospitalNome: agendamento.Hospital?.nome || '',
                caraterprocedimento: agendamento.caraterprocedimento || '',
                tipoprocedimento: agendamento.tipoprocedimento || '',
                statusId: agendamento.Status?.id || 0,
                statusNome: agendamento.Status?.nome || '',
                statusCor: agendamento.Status?.cor || '#000000', // Garantir que a cor está sendo mapeada
                cirurgioesId: agendamento.Cirurgiaos?.map(cirurgiao => cirurgiao.id) || [],
                cirurgioesNomes: agendamento.Cirurgiaos?.map(cirurgiao => cirurgiao.nome) || [],
                pacienteId: agendamento.Paciente?.id || 0,
                pacienteNome: agendamento.Paciente?.nomecompleto || '',
                procedimentosId: agendamento.Procedimentos?.map(proc => proc.id) || [],
                pacienteProvisorioId: agendamento.PacienteProvisorio?.id || 0, // Adicione esta linha

                procedimentosNomes: agendamento.Procedimentos?.map(proc => proc.nome) || [],
                lateralidade: agendamento.lateralidade,
                conveniosId: agendamento.Convenios?.map(convenio => convenio.id) || [],
                conveniosNomes: agendamento.Convenios?.map(convenio => convenio.nome) || [],
                matriculas: [], // Ajuste conforme necessário
                grupodeanestesiaId: agendamento.GrupoDeAnestesium?.id || 0,
                grupodeanestesiaNome: agendamento.GrupoDeAnestesium?.nome || '',
                anestesistaId: agendamento.Anestesistum?.id || 0,
                anestesistaNome: agendamento.Anestesistum?.nomecompleto || '',
                utiPedida: agendamento.utiPedida,
                utiConfirmada: agendamento.utiConfirmada,
                hemoderivadosPedido: agendamento.hemoderivadosPedido,
                hemoderivadosConfirmado: agendamento.hemoderivadosConfirmado,
                apa: agendamento.apa,
                recursoscomplementaresId: agendamento.RecursosComplementares?.map(recurso => recurso.id) || [],
                statusPaciente: agendamento.statusPaciente || 'Definitivo', // Adicione esta linha

            };
        });
    };
    
    

    useFocusEffect(
        React.useCallback(() => {
            const fetchAgendamentos = async () => {
                try {
                    const response = await AgendamentoService.obterAgendamentosDetalhados();
                    console.log('Agendamentos fetched:', response);
    
                    if (response && Array.isArray(response.data)) {
                        const dadosMapeados = mapearDadosAgendamento(response.data);
                        setAgendamentos(dadosMapeados);
                        setFilteredData(dadosMapeados);
                    } else {
                        console.error("A chave 'data' da resposta da API não é um array:", response);
                    }
                } catch (error) {
                    console.error('Erro ao buscar agendamentos:', error);
                }
            };
    
            fetchAgendamentos();
        }, [])
    );
    

    const handlePageChange = async (newPage?: number) => { // Alterei para número opcional
        if (newPage !== undefined) {
            setCurrentPageState(newPage);
    
            try {
                const response = await AgendamentoService.obterAgendamentosDetalhados(25, newPage);
                if (response && Array.isArray(response.data)) {
                    const sortedData = response.data.sort((a: AgendamentoData, b: AgendamentoData) => a.datadacirurgia.localeCompare(b.datadacirurgia));
                    setAgendamentos(sortedData);
                    setFilteredData(sortedData);
                } else {
                    console.error("A resposta da API não é um array ou está indefinida:", response);
                }
            } catch (error) {
                console.error("Erro ao buscar dados da página:", newPage, error);
            }
        }
    };
    
    const handleSearchChange = (text: string) => {
        const allAgendamentos = data?.pages.flat() || []; // Inicializa como um array vazio se for undefined
    
        const newData = allAgendamentos.filter(item => {
            const itemData = item.datadacirurgia ? item.datadacirurgia.toUpperCase() : '';
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    
    
    return (        
    
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoAgendamentos />}>
        <QueryClientProvider client={queryClient}>
            {/* Aqui começa a renderização do componente */}
            <View style={styles.container}>
                
                <View style={styles.searchAndFilterContainer}>
                    <SearchbarAgendamentos
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
                            onPress={() => (navigation as any).navigate('NovoAgendamento')}
                        />
                    </View>
                </View>
                
                   
                {isLoading ? (
                    <Text>Carregando...</Text>
                ) : error ? (
                    <Text>Erro ao carregar os agendamentos.</Text>
                ) : (


                    <ScrollView>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={[styles.cell, { flex: 1 }]}><Text style={styles.headerText}>Status</Text></View>
                            <View style={[styles.cell, { flex: 1.5 }]}><Text style={styles.headerText}>Data - Hora Início</Text></View>
                            <View style={[styles.cell, { flex: 3 }]}><Text style={styles.headerText}>Cirurgião - Procedimentos</Text></View>
                            <View style={[styles.cell, { flex: 0.7 }]}><Text style={styles.headerText}>Ações</Text></View>
                        </View>
    
                        {filteredData.map((agendamento, index) => (
                                    <View key={index} style={styles.row}>
                                    <View style={[styles.cell, { flex: 1 }]}>
                                        <StatusIndicator 
                                            nome={agendamento.statusNome || 'Status Desconhecido'}
                                            cor={agendamento.statusCor || '#000000'} // Cor preta como padrão
                                            id={0}            />
                                        </View>                               
                                    <View style={[styles.cell, { flex: 1.5 }]}>
                                    <Text>{agendamento.datadacirurgia}</Text>
                                    <View style={styles.horizontalLine} />
                                    <Text>{agendamento.horainicio}</Text>
                                </View>
                                <View style={[styles.cell, { flex: 3 }]}>
                                    <Text>{agendamento.cirurgioesNomes?.join(', ')}</Text>
                                    <View style={styles.horizontalLine} />
                                    <Text>{agendamento.procedimentosNomes?.join(', ')}</Text>
                                </View>
                                <View style={[styles.cell, { flex: 0.7 }]}>
                                    {/* Botões de ação aqui */}
                                    <AcoesBotoes 
                                        onEditarPress={() => {/* navegação para edição */}}
                                        onDeletarPress={() => {/* lógica de deleção */}}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                )}
            </View>
        </QueryClientProvider>
        </GlobalLayout>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cabecalhoPadding: {
        paddingLeft: 50, // Ajuste conforme necessário
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
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cellWide: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
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
    horizontalLine: {
        borderBottomWidth: 5,
        borderBottomColor: 'black',
        marginVertical: 5,
    },
  
});

export default IndexAgendamento;

