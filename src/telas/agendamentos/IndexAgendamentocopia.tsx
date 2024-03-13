import React, { useCallback, useEffect, useState } from 'react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(
        'agendamentos',
        ({ pageParam = currentPage }) => AgendamentoService.obterAgendamentosDetalhados(25, pageParam),
        {
            getNextPageParam: (lastPage, allPages) => {
                const nextPage = allPages.length + 1;
                return nextPage <= lastPage.meta.totalPages ? nextPage : undefined;
            },
        }
    );

    console.log(data); // Adicione esta linha para verificar os dados recebidos



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
        console.log("Dados recebidos para mapeamento:", dados); // Adicione esta linha

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
                statusCor: agendamento.Status?.cor || '#000000',
                cirurgioesId: agendamento.Cirurgiaos?.map(cirurgiao => cirurgiao.id) || [],
                cirurgioesNomes: agendamento.Cirurgiaos?.map(cirurgiao => cirurgiao.nome) || [],
                pacienteId: agendamento.Paciente?.id || 0,
                pacienteNome: agendamento.Paciente?.nomecompleto || '',
                procedimentosId: agendamento.Procedimentos?.map(proc => proc.id) || [],
                pacienteProvisorioId: agendamento.PacienteProvisorio?.id || 0,
                procedimentosNomes: agendamento.Procedimentos?.map(proc => proc.nome) || [],
                lateralidade: agendamento.lateralidade,
                conveniosId: agendamento.Convenios?.map(convenio => convenio.id) || [],
                conveniosNomes: agendamento.Convenios?.map(convenio => convenio.nome) || [],
                matriculas: [],
                grupodeanestesiaId: agendamento.GrupoDeAnestesium?.id || 0,
                grupodeanestesiaNome: agendamento.GrupoDeAnestesium?.nome || '',
                anestesistaId: agendamento.Anestesistum?.id || 0,
                anestesistaNome: agendamento.Anestesistum?.nomecompleto || '',
                utiPedida: agendamento.utiPedida,
                utiConfirmada: agendamento.utiConfirmada,
                hemoderivadosPedido: agendamento.hemoderivadosPedido,
                hemoderivadosConfirmado: agendamento.hemoderivadosConfirmado,
                apa: agendamento.apa,
                recursoscomplementaresId: agendamento.recursocomplementars?.map(recurso => recurso.id) || [],
                statusPaciente: agendamento.statusPaciente || 'Definitivo',
                fornecedoresId: agendamento.Fornecedors?.map(fornecedor => fornecedor.id) || [],
                opmeId: agendamento.OPMEs?.map(opme => opme.id) || [],
                instrumentaisId: agendamento.Instrumentals?.map((instrumental: { id: any; }) => instrumental.id) || [],
                fiosComQuantidade: agendamento.Fios?.map((fio) => {
                    console.log("Processando fio:", fio); // Veja a estrutura de cada fio
                    return {
                        fioId: fio.id,
                        nome: fio.nome,
                        quantidadeNecessaria: fio.AgendamentoFios?.quantidadeNecessaria,
                    };
                }) || [],
                leito: agendamento.leito,
                aviso: agendamento.aviso,
                prontuario: agendamento.prontuario,
                pacote: agendamento.pacote,
                createdAt: agendamento.createdAt,
                updatedAt: agendamento.updatedAt,
            };
        });
    };

    useEffect(() => {
        if (data?.pages) {
            const allAgendamentos = data.pages.flatMap(page => page.data);
            const mapeados = mapearDadosAgendamento(allAgendamentos); // Definindo mapeados corretamente
        console.log("Dados mapeados:", mapeados); // Usando dentro do escopo correto

        setAgendamentos(mapeados); // Usando a variável mapeados
            // Supondo que a meta esteja na última página:
            const totalPages = data.pages[data.pages.length - 1].meta.totalPages;
            setTotalPages(totalPages);
        }
    }, [data]);
    

      
    
    

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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

            <Paginacao
                currentPage={currentPage}
                totalPages={totalPages}
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

