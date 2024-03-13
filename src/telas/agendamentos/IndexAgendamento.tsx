import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import * as AgendamentoService from '../../services/AgendamentoService';
import { DadosAgendamentoApi } from '../../types'; // Ajuste o caminho conforme necessário
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import SearchbarAgendamentos from './componentes/SearchbarAgendamentos';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useInfiniteQuery, QueryClient, QueryClientProvider } from 'react-query';
import Paginacao from '../../componentes/paginacao/Paginacao';
import { useQuery } from 'react-query';
import AgendamentoContext from '../../context/AgendamentoContext';

const queryClient = new QueryClient();


const StatusIndicator = ({ nome, cor, id }: { nome: string; cor: string; id: number }) => {
  const animation = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();
    }, [animation]);
    
    return (
      <View style={{ alignItems: 'center' }}>
        <Animated.View style={[styles.statusIndicator, { backgroundColor: cor, opacity: animation }]}>
          <Text style={styles.statusText}>{nome.charAt(0)}</Text>
        </Animated.View>
        <Text style={styles.statusName}>{nome}</Text>
        <Text style={styles.linhaHorizontal}></Text>

        <Text style={styles.agendamentoId}>id:</Text>
        <Text style={styles.agendamentoId2}>{id}</Text>

      </View>
    );
};
const IndexAgendamento = () => {

    const [agendamentos, setAgendamentos] = useState<DadosAgendamentoApi[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [filteredData, setFilteredData] = useState<DadosAgendamentoApi[]>([]);
    const navigation = useNavigation();
    const [currentPageState, setCurrentPageState] = useState<number>(1);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { limparDadosAgendamento } = useContext(AgendamentoContext); // Supondo que o contexto seja chamado AgendamentoContext


    const fetchAgendamentos = async (page: number | undefined) => {
      // Ajustando para a chamada da API com paginação
      const response = await AgendamentoService.obterAgendamentosDetalhados(25, page);
      // A resposta da API inclui os agendamentos e metadados, então retornamos ambos
      return {
        items: response.data, // Os agendamentos
        totalPages: response.meta.totalPages, // Total de páginas disponíveis
      };
    };
    

    const { data, isError, isLoading, error } = useQuery(['agendamentos', currentPage], () => fetchAgendamentos(currentPage), {
      keepPreviousData: true,
      onSuccess: (data) => {
        // Aqui, `data` é o objeto retornado por `fetchAgendamentos`
        setTotalPages(data.totalPages); // Atualiza o estado de total de páginas com o valor correto
        setAgendamentos(data.items); // Atualiza o estado de agendamentos com os novos dados
      },
    });
    

  const handlePageChange = (newPage: React.SetStateAction<number>) => {
      setCurrentPage(newPage);
  };
    

  

  const carregarAgendamentos = async () => {
      const res = await AgendamentoService.obterAgendamentosDetalhados();
      setAgendamentos(res.data);
  };

  const iniciarNovoAgendamento = () => {
    limparDadosAgendamento(); // Limpa os dados existentes
    (navigation as any).navigate('NovoAgendamento'); // Navega para a tela de novo agendamento
};

  

  const deletarAgendamento = async (id: number) => {
    Alert.alert(
        "Confirmar exclusão",
        "Deseja realmente excluir este agendamento?",
        [
            {
                text: "Cancelar",
                style: "cancel"
            },
            { 
                text: "Excluir", 
                onPress: async () => {
                    try {
                        const resposta = await AgendamentoService.deletarAgendamento(id);
                        if (resposta.status === 200) {
                            // Se a API retornar um sucesso (200 OK), recarregue os agendamentos
                            Alert.alert("Sucesso", "Agendamento excluído com sucesso.");
                            carregarAgendamentos(); // Função que carrega todos os agendamentos novamente
                        } else {
                            // Se a API retornar outro status, avise o usuário sobre a falha
                            Alert.alert("Falha na exclusão", "Não foi possível excluir o agendamento.");
                        }
                    } catch (erro) {
                        // Tratamento de erro caso a requisição falhe
                        console.error("Erro ao deletar agendamento:", erro);
                        Alert.alert("Erro", "Ocorreu um erro ao tentar deletar o agendamento.");
                    }
                }
            }
        ],
        { cancelable: false } // Esta opção impede que o Alert seja cancelado ao tocar fora dele
    );
};


    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const renderBoolean = (title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, value: boolean) => (
        <Text style={[styles.detalhesTexto, { color: value ? 'green' : 'red' }]}>
          {title}: {value ? 'Sim' : 'Não'}
        </Text>
      );

      const handleSearchChange = (text: string) => {
        const newData = agendamentos.filter(agendamento =>
          agendamento.Paciente?.nomecompleto.toLowerCase().includes(text.toLowerCase()) ||
          agendamento.PacienteProvisorio?.nomecompleto.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(newData.length > 0 ? newData : agendamentos);
      };
      
      useFocusEffect(
        React.useCallback(() => {
          const fetchData = async () => {
            try {
              const res = await AgendamentoService.obterAgendamentosDetalhados();
              console.log(res.data); // Para depuração
              setAgendamentos(res.data);
              setFilteredData(res.data); // Inicialize filteredData com os dados carregados
            } catch (error) {
              console.error('Erro ao buscar agendamentos:', error);
            }
          };
      
          fetchData();
      
          // Esta função é chamada quando o componente é desmontado ou quando o foco é perdido
          return () => {
            // Se necessário, faça a limpeza de estados ou cancelamento de requisições aqui
          };
        }, [])
      );
      
      

      const calcularidade = (dataNascimento: string | number | Date) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        const diferencaEmMilissegundos = hoje.getTime() - nascimento.getTime();
        const diferencaEmDias = diferencaEmMilissegundos / (1000 * 3600 * 24);
        let idade = '';
      
        if (diferencaEmDias < 30) {
          idade = `${Math.round(diferencaEmDias)} dias`;
        } else if (diferencaEmDias < 365) {
          idade = `${Math.round(diferencaEmDias / 30)} meses`;
        } else {
          const anos = hoje.getFullYear() - nascimento.getFullYear();
          const m = hoje.getMonth() - nascimento.getMonth();
          if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade = `${anos - 1} anos`;
          } else {
            idade = `${anos} anos`;
          }
        }
      
        return idade;
      };

      const renderProcedimentos = (procedimentos: { nome: string; codigoTUSS: string }[]) => {
        return procedimentos.map((procedimento, index) => (
          <Text key={index} style={styles.listItem}>
            {`${procedimento.codigoTUSS} - ${procedimento.nome}`}
          </Text>
        ));
      };

      const formatarDataNascimento = (dataNascimentoString: string | number | Date) => {
        const data = new Date(dataNascimentoString);
        return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
      };

      // Função para formatar o horário para o formato HH:MM
const formatarHorario = (horario: string) => {
  const [hora, minuto] = horario.split(':');
  return `${hora}:${minuto}`;
};

// Função para converter a duração em horas e minutos (assumindo que a duração vem em um formato como "HH:MM:SS" ou "HH:MM")
const formatarDuracao = (duracao: string) => {
  const [horas, minutos] = duracao.split(':');
  return `${horas}h${minutos}min`;
};

      
      
      
      
      // Função para renderizar listas de detalhes, similar às funções renderDetalhes e renderDetalheSimples
      const renderList = (title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, items: any[], property: string) => {
        if (!items || items.length === 0) {
          return (
            <Text style={styles.listItem}>{title}: Não informado</Text>
          );
        }

        
      
        return (
          <>
            <Text style={styles.listTitle}>{title}:</Text>
            {items.map((item: { [x: string]: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
              <Text key={index} style={styles.listItem}>{item[property]}</Text>
            ))}
          </>
        );
      };

      

      return (
        <GlobalLayout showBackButton={true}>
        <ScrollView style={styles.container}>
          <View style={styles.searchAndFilterContainer}>
            <SearchbarAgendamentos onSearchChange={handleSearchChange} />
            <Icon
              name="plus"
              size={24}
              color="#000"
              style={styles.iconStyle}
              onPress={iniciarNovoAgendamento}
            />
          </View>

          
          


            {agendamentos.map((agendamento, index) => (
              <View key={index} style={styles.agendamentoContainer}>
                <View style={styles.row}>
                  <View style={[styles.cell, { flex: 1 }]}>
                    <StatusIndicator
                      nome={agendamento.Status?.nome ?? 'Desconhecido'}
                      cor={agendamento.Status?.cor ?? '#FFFFFF'}
                      id={agendamento.id} // Passando o id como prop

                    />

                   </View>

      {/* Coluna 2 - Data e Hora */}
      <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.cellText}>
              {formatarData(agendamento.datadacirurgia)}
          </Text>
          {/* Nova linha para mais espaço, se necessário */}
          <View style={styles.linhaHorizontal}></View>
          <Text style={styles.cellText}>
              Horário: {formatarHorario(agendamento.horainicio)}
          </Text>
          <Text style={styles.cellText}>
              Duração: {formatarDuracao(agendamento.duracao)}
          </Text>
      </View>


      <View style={[styles.cell, { flex: 2.5 }]}>
    <Text style={styles.cellText}>
        {agendamento.Paciente?.nomecompleto || agendamento.PacienteProvisorio?.nomecompleto || 'Não informado'}
    </Text>
    {/* Linha horizontal após o nome, antes da idade e data de nascimento */}
    <View style={styles.linhaHorizontal}></View>
    
    <Text style={styles.cellText}>
        {agendamento.Paciente ? calcularidade(agendamento.Paciente.datadenascimento) : 'Não informado'}
    </Text>
    <Text style={styles.cellText}>
        {agendamento.Paciente ? `Nasc: ${formatarDataNascimento(agendamento.Paciente.datadenascimento)}` : ''}
    </Text>
    
  </View>
      {/* Coluna de Cirurgião e Procedimentos */}
              <TouchableOpacity style={[styles.cell, { flex: 5 }]} onPress={() => toggleExpand(index)}>
                {(agendamento.Cirurgiaos ?? []).map((c, idx) => (
                  <React.Fragment key={idx}>
                    <Text style={styles.cellText}>{c.nome}</Text>
                    {/* Linha horizontal após o último cirurgião, antes dos procedimentos */}
                    {idx === (agendamento.Cirurgiaos ?? []).length - 1 && (agendamento.Procedimentos?.length ?? 0) > 0 && <View style={styles.linhaHorizontal} />}
                  </React.Fragment>
                ))}
                {agendamento.Procedimentos?.map((procedimento, procIdx) => (
                  <Text key={procIdx} style={styles.cellText}>
                    {procedimento.codigoTUSS} - {procedimento.nome}
                  </Text>
                ))}
              </TouchableOpacity>


                <View style={[styles.cell, { flex: 0.7 }]}>
                  <AcoesBotoes
                    onEditarPress={() => {
                      // Navegação para edição
                      (navigation as any).navigate('NovoAgendamento', { agendamentoId: agendamento.id });
                    }}
                    onDeletarPress={() => {
                      Alert.alert(
                        "Confirmação",
                        "Tem certeza que deseja excluir este agendamento?",
                        [
                          {
                            text: "Não",
                            style: "cancel"
                          },
                          { text: "Sim", onPress: () => deletarAgendamento(agendamento.id) }
                        ]
                      );
                    }}
                  />
                </View>
                </View>
                
                <View style={styles.additionalInfoContainer}>
                    {(agendamento.Paciente?.VAD || agendamento.PacienteProvisorio?.VAD) && <View style={[styles.additionalTag, { backgroundColor: 'blue' }]}><Text style={styles.additionalText}>VAD</Text></View>}
                    {(agendamento.Paciente?.alergia || agendamento.PacienteProvisorio?.alergia) && <View style={[styles.additionalTag, { backgroundColor: 'yellow' }]}><Text style={styles.additionalTextEscuro}>Alergia</Text></View>}
                    {(agendamento.Paciente?.alergiaLatex || agendamento.PacienteProvisorio?.alergiaLatex) && <View style={[styles.additionalTag, { backgroundColor: 'green' }]}><Text style={styles.additionalText}>Alergia a Látex</Text></View>}
                    {agendamento.hemoderivadosPedido && <View style={[styles.additionalTag, { backgroundColor: 'red' }]}><Text style={styles.additionalText}>Hemoderivados Pedido</Text></View>}
                    {agendamento.hemoderivadosConfirmado && <View style={[styles.additionalTag, { backgroundColor: 'darkred' }]}><Text style={styles.additionalText}>Hemoderivados Confirmado</Text></View>}
                    {agendamento.utiPedida && <View style={[styles.additionalTag, { backgroundColor: 'purple' }]}><Text style={styles.additionalText}>UTI Pedida</Text></View>}
                    {agendamento.utiConfirmada && <View style={[styles.additionalTag, { backgroundColor: 'darkpurple' }]}><Text style={styles.additionalText}>UTI Confirmada</Text></View>}
                    {agendamento.apa ? <View style={[styles.additionalTag, { backgroundColor: 'pink' }]}><Text style={styles.additionalTextEscuro}>APA OK</Text></View> : <View style={[styles.additionalTag, { backgroundColor: 'black' }]}><Text style={styles.additionalText}>SEM APA</Text></View>}
                </View>

              
             
                {expandedIndex === index && (
                  <View style={styles.expandedSection}>
                    <View style={styles.detalhesDuasColunasContainer}>
                      <View style={styles.coluna}>
                        <Text style={styles.detalhesTexto}>Hospital: {agendamento.Hospital?.nome || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Setor: {agendamento.Setor?.nome || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Sala de Cirurgia: {agendamento.SaladeCirurgia ? agendamento.SaladeCirurgia.nome : 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Caráter do Procedimento: {agendamento.caraterprocedimento || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Tipo de Procedimento: {agendamento.tipoprocedimento || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Lateralidade: {agendamento.lateralidade || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Prontuário: {agendamento.prontuario || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Status do Paciente: {agendamento.statusPaciente || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Tipo de Acomodação: {agendamento.tipoDeAcomodacao || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Leito: {agendamento.leito || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Aviso: {agendamento.aviso || 'Não informado'}</Text>
                        <Text style={styles.detalhesTexto}>Observação: {agendamento.observacoes || 'Não informado'}</Text>

                        {renderBoolean('UTI Pedida', agendamento.utiPedida)}
                        {renderBoolean('UTI Confirmada', agendamento.utiConfirmada)}
                        {renderBoolean('Hemoderivados Pedido', agendamento.hemoderivadosPedido)}
                        {renderBoolean('Hemoderivados Confirmado', agendamento.hemoderivadosConfirmado)}
                        {renderBoolean('APA', agendamento.apa)}
                        {renderBoolean('Pacote', agendamento.pacote)}
                        {renderBoolean('Mudança de Acomodação', agendamento.mudancaDeAcomodacao)}
                        
                      </View>
                      <View style={styles.coluna}>
                        
                        {renderList('Convênios', agendamento.Convenios ?? [], 'nome')}
                        {renderList('Grupo de Anestesia', agendamento.GrupoDeAnestesium ? [agendamento.GrupoDeAnestesium] : [], 'nome')}
                        {renderList('Anestesista', agendamento.Anestesistum ? [agendamento.Anestesistum] : [], 'nomecompleto')}
                        {renderList('Fornecedores', agendamento.Fornecedors ?? [], 'nome')}
                        {renderList('OPMEs', agendamento.OPMEs ?? [], 'nome')}
                        {renderList('Recursos Complementares', agendamento.recursocomplementars ?? [], 'recurso')}
                        {renderList('Instrumentais', agendamento.Instrumentals ?? [], 'nome')}
                        {renderList('Convênios', agendamento.Convenios ?? [], 'nome')}
                        {renderList('Grupo de Anestesia', agendamento.GrupoDeAnestesium ? [agendamento.GrupoDeAnestesium] : [], 'nome')}
                        {renderList('Anestesista', agendamento.Anestesistum ? [agendamento.Anestesistum] : [], 'nomecompleto')}
                        <Text style={styles.expandedTitle}>Fios:</Text>
                        {agendamento.Fios?.length ? agendamento.Fios.map((fio, idx) => (
                          <Text key={idx} style={styles.listItem}>
                            {fio.nome} - Quant: {fio.AgendamentoFios?.quantidadeNecessaria || 'Não informado'}
                          </Text>
                        )) : <Text style={styles.listItem}>Fios: Não informado</Text>}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
           <Paginacao
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </ScrollView>
        </GlobalLayout>
      );
      
      
      
};

// Estilos (ajuste conforme necessário)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchAndFilterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 25,
  },
  iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flex: 0.15,
  },
  iconStyle: {
      marginLeft: 10,
  },
  agendamentoContainer: {
    width: '96%', // Ajuste a largura para 96% da tela
    alignSelf: 'center', // Centraliza o contêiner na tela
    marginBottom: 18,
    borderWidth: 1, // Espessura da borda
    borderColor: '#e0e0e0', // Cor da borda
    borderRadius: 20, // Raio da borda para torná-la levemente arredondada
    backgroundColor: '#FFFFFF', // Cor de fundo do contêiner, se necessário
    overflow: 'hidden', // Garante que o conteúdo interno não sobreponha as bordas arredondadas
},

    linhaHorizontal: {
      height: 1,
      backgroundColor: 'black', // Cor cinza para a linha
      marginVertical: 4, // Ajuste o espaçamento vertical conforme necessário
      width: '90%', // Certifica que a linha ocupa toda a largura disponível
    },
    
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start', // Alinha itens no início
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd', // Linha divisória entre as linhas
    },
    cell: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      minHeight: 60, // Defina uma altura mínima para a célula baseada no conteúdo que você espera
    },
    cellText: {
        fontSize: 15,
        color: 'black',
    },

    additionalInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      flexWrap: 'wrap', // Permite que os itens se alinhem lado a lado e quebrem a linha conforme necessário
      padding: 10, // Espaçamento interno para afastar os itens das bordas do contêiner
  },
  additionalTag: {
    borderRadius: 5,
    padding: 5,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
},

additionalText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
},
additionalTextEscuro: {
  color: 'black',
  fontSize: 14,
  fontWeight: 'bold',
},
    conditionText: {
      color: '#fff',
      fontSize: 12,
    },

    agendamentoId: {
      marginTop: 4, // Espaçamento acima do ID
      fontSize: 12, // Tamanho da fonte menor do que o nome do status
      color: '#666',
      marginBottom: -4, 
  },

  agendamentoId2: {
    marginTop: 4, // Espaçamento acima do ID
    fontSize: 14, // Tamanho da fonte menor do que o nome do status
    color: 'black',
    fontWeight: 'bold', // Uma cor mais suave para o ID 
},
    expandedSection: {
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    statusIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        ustifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 14,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',

    },
    
      expandedTitle: {
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: 16,
      },
      listTitle: {
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: 14,
      },
      listItem: {
        marginLeft: 10,
        fontSize: 14,
      },
      detalhesTexto: {
        fontSize: 14,
        marginLeft: 10,
        color: '#333',
        paddingVertical: 5, 
      },
      detalhesDuasColunasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      coluna: {
        width: '50%',
      },

      rowHeader: {
        width: '95%', 
        height: 60, // Ajuste a altura conforme necessário  
        alignSelf: 'center', // Centraliza o contêiner na tela
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 20, // Espaçamento superior para distanciar do conteúdo acima
        borderWidth: 1, // Espessura da borda
        borderColor: '#ddd', // Cor da borda
        borderRadius: 20, // Raio da borda para torná-la levemente arredondada
        backgroundColor: 'black', // Cor de fundo do contêiner
        overflow: 'hidden', // Garante que o conteúdo interno não sobreponha as bordas arredondadas
        padding: 10, // Espaçamento interno
    },
      cellHeader: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 0,
        minHeight: 50, // Garante espaço vertical suficiente para duas linhas
      },
      
      headerText: {
        fontWeight: 'bold',
        color: 'white', // Cor do texto
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 14, // Ajuste conforme necessário para caber no espaço disponível
      },
      statusName: {
        marginTop: 2, // Ajuste o espaçamento conforme necessário
        fontSize: 12, // Diminua o tamanho da fonte para o nome completo do status
        color: '#000000', // Ajuste a cor conforme necessário
      },
      conditionsContainer: {
        flexDirection: 'row', // Itens alinhados em linha
        flexWrap: 'wrap', // Permite a quebra de linha se não houver espaço
        marginVertical: 4, // Margem vertical para separar dos outros elementos
      },
      
      conditionContainer: {
        borderRadius: 8, // Ajuste conforme necessário para arredondamento
        paddingVertical: 2, // Espaçamento vertical interno
        paddingHorizontal: 4, // Espaçamento horizontal interno
        margin: 2, // Espaçamento entre contêineres
        alignItems: 'center', // Centraliza o texto horizontalmente
        justifyContent: 'center', // Centraliza o texto verticalmente
      },
      
     
    
      
});

export default IndexAgendamento;
