import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AppButton from '../../componentes/Botões/AppButton';
import { useNavigation } from '@react-navigation/native';
import AgendamentoContext from '../../context/AgendamentoContext';
import * as AgendamentoService from '../../services/AgendamentoService';
import * as ProcedimentoService from '../../services/ProcedimentoService';
import * as HospitalService from '../../services/HospitalService';
import * as StatusService from '../../services/StatusService';
import * as ConvenioService from '../../services/ConvenioService';
import * as CirurgiaoService from '../../services/CirurgiaoService';
import * as GrupoDeAnestesiaService from '../../services/GrupoDeAnestesiaService';
import * as FornecedorService from '../../services/FornecedorService';
import * as OPMEService from '../../services/OPMEService';
import * as PacienteService from '../../services/PacienteService';
import * as PacienteProvisorioService from '../../services/PacienteProvisorioService';
import * as AnestesistaService from '../../services/AnestesistaService';
import * as RecursoComplementarService from '../../services/RecursoComplementarService';
import { PacienteData } from '../../types';
import { PacienteProvisorioData } from '../../types';
import { AgendamentoData } from '../../types';
import { DadosAgendamentoApi } from '../../types';
import { DetalhesAgendamento, Fio } from '../../types/DetalhesAgendamento';



interface Etapa6AgendamentoProps {
    dadosAgendamento: AgendamentoData;
    irParaEtapaAnterior: () => void;
  }

  interface DetailRowProps {
    label: string;
    value?: string | null;
}

interface DetailListProps {
    label: string;
    items?: string[] | null;
}


  const Etapa6Agendamento: React.FC<Etapa6AgendamentoProps> = ({ dadosAgendamento, irParaEtapaAnterior }) => {
    const navigation = useNavigation();
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, limparDadosAgendamento } = useContext(AgendamentoContext);
    const [detalhesAgendamento, setDetalhesAgendamento] = useState<DetalhesAgendamento | null>(null);
    const [nomesCirurgioes, setNomesCirurgioes] = useState<string[]>([]);
    const [nomesConvenios, setNomesConvenios] = useState<string[]>([]);
    const [nomesProcedimentos, setNomesProcedimentos] = useState<string[]>([]);
    const [nomeHospital, setNomeHospital] = useState('');
    const [nomeAnestesista, setNomeAnestesista] = useState('');

    const dadosCombinados = { ...dadosEtapa1, ...dadosEtapa2, ...dadosEtapa3, ...dadosEtapa4, ...dadosEtapa5 };

    const transformarParaDadosAgendamentoApi = async (): Promise<AgendamentoData> => {
        // Aqui você combina os dados de todas as etapas
        const dadosCombinados: AgendamentoData = {
            // Certifique-se de que todos os campos obrigatórios estejam presentes
            datadacirurgia: dadosEtapa1?.dataSelecionada || '',
            horainicio: dadosEtapa1?.horarioInicio || '',
            duracao: dadosEtapa1?.duracao || '',
            hospitalId: dadosEtapa1?.hospitalId || 0,
            setorId: dadosEtapa1?.setorId || null,
            caraterprocedimento: dadosEtapa1?.caraterprocedimento || '',
            tipoprocedimento: dadosEtapa1?.tipoprocedimento || '',
            statusId: dadosEtapa1?.statusId || 0,
            cirurgioesId: dadosEtapa1?.cirurgioesSelecionados || [],
            procedimentosId: dadosEtapa3?.procedimentosSelecionados || [],
            lateralidade: dadosEtapa3?.lateralidade || '',
            conveniosId: dadosEtapa3?.conveniosSelecionados || [],
            matricula: dadosEtapa3?.matricula || '',
            grupodeanestesiaId: dadosEtapa4?.grupoDeAnestesiaSelecionado || null,
            anestesistaId: dadosEtapa4?.anestesistaSelecionado || null,
            utiPedida: dadosEtapa4?.utiPedida || false,
            utiConfirmada: dadosEtapa4?.utiConfirmada || false,
            hemoderivadosPedido: dadosEtapa4?.hemoderivadosPedido || false,
            hemoderivadosConfirmado: dadosEtapa4?.hemoderivadosConfirmado || false,
            apa: dadosEtapa4?.apa || false,
            recursosComplementaresId: dadosEtapa5?.materiaisEspeciais || [],
            opmeId: dadosEtapa5?.opmesSelecionadas || [],
            fornecedoresId: dadosEtapa5?.fornecedoresSelecionados || [],
            pacienteId: dadosEtapa2?.pacienteId,
            pacienteProvisorioId: dadosEtapa2?.pacienteProvisorioId,
            statusPaciente: dadosEtapa2?.statusPaciente || 'Definitivo',
            leito: dadosEtapa4?.leito || '',
            aviso: dadosEtapa4?.aviso || '',
            prontuario: dadosEtapa4?.prontuario || '',
            pacote: dadosEtapa4?.pacote || false,
            observacoes: dadosEtapa5?.observacoes || '',
            tipoDeAcomodacao: dadosEtapa4?.tipoDeAcomodacao || '',
            mudancaDeAcomodacao: dadosEtapa4?.mudancaDeAcomodacao || false,
            fiosComQuantidade: dadosEtapa5?.fiosComQuantidade.map(fio => ({
                id: fio.id,
                nome: fio.nome, // Garanta que esta propriedade está presente
                AgendamentoFios: {
                    quantidadeNecessaria: fio.AgendamentoFios.quantidadeNecessaria
                }
            })) || [],
            instrumentaisId: dadosEtapa5?.instrumentaisSelecionados || [],  
        };

        console.log("Dados Combinados para o Agendamento:", dadosCombinados);
        return dadosCombinados;
    };

    const finalizarAgendamento = async () => {
        try {
            const dadosAgendamentoApi = await transformarParaDadosAgendamentoApi();
            console.log("Dados Agendamento API antes de finalizar:", dadosAgendamentoApi); // Log antes de tentar finalizar

            let response;
    
            // Verifica se está editando um agendamento existente
            if (dadosAgendamento.id) {
                console.log("Atualizando agendamento com ID:", dadosAgendamento.id); // Log antes de atualizar
                response = await AgendamentoService.atualizarAgendamento(dadosAgendamento.id, dadosAgendamentoApi);

                Alert.alert('Sucesso', 'Agendamento atualizado com sucesso!');
            } else {
                console.log("Criando novo agendamento."); // Log antes de criar
                response = await AgendamentoService.criarAgendamento(dadosAgendamentoApi);
                Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
            }
    
            console.log("Resposta da API:", response);
            limparDadosAgendamento();
            (navigation as any).navigate('IndexAgendamento');
        } catch (error) {
            console.error("Erro ao tentar finalizar agendamento:", error);
    
            // Exemplo de análise de erro
            let errorMessage = "Ocorreu um erro desconhecido.";
            if (error instanceof Error) {
                // Aqui você pode analisar o objeto de erro ou sua mensagem para fornecer feedback mais específico
                errorMessage = error.message;
            }

            // Exemplo: verificando o status da resposta para customizar a mensagem de erro
            if ((error as any).response && (error as any).response.status === 400) {
                errorMessage = "Dados inválidos. Por favor, verifique as informações fornecidas.";
            } else if ((error as any).response && (error as any).response.status === 500) {
                errorMessage = "Problema no servidor. Por favor, tente novamente mais tarde.";
            }

            Alert.alert('Falha', errorMessage);
        }
    };
    
    
    useEffect(() => {
        const fetchAgendamentoDetalhes = async () => {
            if (dadosAgendamento.id) {
                try {
                    const detalhes = await AgendamentoService.obterAgendamentoPorId(dadosAgendamento.id);
                    setDetalhesAgendamento(detalhes);
                } catch (error) {
                    console.error("Erro ao buscar detalhes do agendamento:", error);
                    Alert.alert("Erro", "Não foi possível obter os detalhes do agendamento.");
                }
            }
        };
        fetchAgendamentoDetalhes();
    }, [dadosAgendamento.id]);

    

    const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
        value ? (
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}:</Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
        ) : null
    );
    
    // Atualizando a função DetailList para usar a interface DetailListProps
    const DetailList: React.FC<DetailListProps> = ({ label, items }) => (
        items && items.length > 0 ? (
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}:</Text>
                <Text style={styles.detailValue}>{items.join(', ')}</Text>
            </View>
        ) : null
    );

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
    
    // Função para formatar a hora para o formato HH:MM
    const formatTime = (timeString: any) => {
        const time = new Date(`1970-01-01T${timeString}Z`);
        return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const DetailFios: React.FC<{fios: Fio[]}> = ({ fios }) => (
        fios.length > 0 ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fios:</Text>
            {fios.map((fio, index) => (
              <Text key={index} style={styles.detailValue}>{`${fio.nome}: ${fio.quantidadeNecessaria || 'N/A'}`}</Text>
            ))}
          </View>
        ) : null
      );

      useEffect(() => {
        const fetchAgendamentoDetalhes = async () => {
            // Sua lógica existente para buscar detalhes do agendamento
        };
        fetchAgendamentoDetalhes();
    }, [dadosAgendamento.id]);
    
    // Preparação dos detalhes dos fios com a quantidade necessária
    let detalhesFios = [];
    if (detalhesAgendamento && detalhesAgendamento.Fios) {
        detalhesFios = detalhesAgendamento.Fios.map(fio => {
            return `${fio.nome} (Quantidade necessária: ${fio.quantidadeNecessaria})`;
        });
    }
    
      
    
  

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Detalhes do Agendamento</Text>
            <Text style={styles.subtitle}>Revise os dados e salve e agendamento</Text>

            <View style={styles.card}>
                {/* Dados básicos do agendamento */}
                <DetailRow label="Data da Cirurgia" value={detalhesAgendamento?.datadacirurgia ? formatDate(detalhesAgendamento.datadacirurgia) : 'N/A'} />
                <DetailRow label="Hora de Início" value={detalhesAgendamento?.horainicio ? formatTime(detalhesAgendamento.horainicio) : 'N/A'} />
                <DetailRow label="Duração" value={detalhesAgendamento?.duracao ? formatTime(detalhesAgendamento.duracao) : 'N/A'} />
                <DetailRow label="Caráter do Procedimento" value={detalhesAgendamento?.caraterprocedimento || 'N/A'} />
                <DetailRow label="Tipo de Procedimento" value={detalhesAgendamento?.tipoprocedimento || 'N/A'} />
                <DetailRow label="Lateralidade" value={detalhesAgendamento?.lateralidade || 'N/A'} />
                <DetailRow label="Matrícula" value={detalhesAgendamento?.matricula || 'N/A'} />
                <DetailRow label="UTI Pedida" value={detalhesAgendamento?.utiPedida ? 'Sim' : 'Não'} />
                <DetailRow label="UTI Confirmada" value={detalhesAgendamento?.utiConfirmada ? 'Sim' : 'Não'} />
                <DetailRow label="Hemoderivados Pedido" value={detalhesAgendamento?.hemoderivadosPedido ? 'Sim' : 'Não'} />
                <DetailRow label="Hemoderivados Confirmado" value={detalhesAgendamento?.hemoderivadosConfirmado ? 'Sim' : 'Não'} />
                <DetailRow label="APA" value={detalhesAgendamento?.apa ? 'Sim' : 'Não'} />
                <DetailRow label="Leito" value={detalhesAgendamento?.leito || 'N/A'} />
                <DetailRow label="Aviso" value={detalhesAgendamento?.aviso || 'N/A'} />
                <DetailRow label="Prontuário" value={detalhesAgendamento?.prontuario || 'N/A'} />
                <DetailRow label="Pacote" value={detalhesAgendamento?.pacote ? 'Sim' : 'Não'} />
                <DetailRow label="Observações" value={detalhesAgendamento?.observacoes || 'N/A'} />
                <DetailRow label="Tipo de Acomodação" value={detalhesAgendamento?.tipoDeAcomodacao || 'N/A'} />
                <DetailRow label="Mudança de Acomodação" value={detalhesAgendamento?.mudancaDeAcomodacao ? 'Sim' : 'Não'} />
    
                {/* Detalhes de relacionamentos */}
                <DetailRow label="Hospital" value={detalhesAgendamento?.Hospital?.nome || 'N/A'} />
                <DetailRow label="Setor" value={detalhesAgendamento?.Setor?.nome || 'N/A'} />
                <DetailRow label="Grupo de Anestesia" value={detalhesAgendamento?.GrupoDeAnestesium?.nome || 'N/A'} />
                <DetailRow label="Sala de Cirurgia" value={detalhesAgendamento?.SalaDeCirurgia?.nome || 'N/A'} />
                {/* Renderização condicional do paciente ou paciente provisório */}
            {detalhesAgendamento?.Paciente && (
                <DetailRow label="Paciente" value={detalhesAgendamento.Paciente.nomecompleto} />
            )}
            {detalhesAgendamento?.PacienteProvisorio && (
                <DetailRow label="Paciente Provisório" value={detalhesAgendamento.PacienteProvisorio.nomecompleto} />
            )}
    
                {/* Listas de entidades relacionadas */}
                <DetailList label="Procedimentos" items={detalhesAgendamento?.Procedimentos?.map(p => p.nome) || ['N/A']} />
                <DetailList label="Cirurgiões" items={detalhesAgendamento?.Cirurgiaos?.map(c => c.nome) || ['N/A']} />
                <DetailList label="Convênios" items={detalhesAgendamento?.Convenios?.map(c => c.nome) || ['N/A']} />
                
                <DetailList label="Recursos Complementares" items={detalhesAgendamento?.recursocomplementars?.map(rc => rc.recurso) || ['N/A']} />
                <DetailList label="Fios" items={detalhesAgendamento?.Fios?.map(f => `${f.nome} (Quantidade necessária: ${f.quantidadeNecessaria})`) || ['N/A']} />
                <DetailList label="Instrumentais" items={detalhesAgendamento?.Instrumentals?.map(i => i.nome) || ['N/A']} />
                <DetailList label="OPMEs" items={detalhesAgendamento?.OPMEs?.map(opme => opme.nome) || ['N/A']} />
                <DetailList label="Fornecedores" items={detalhesAgendamento?.Fornecedors?.map(f => f.nome) || ['N/A']} />
            </View>
            <View style={styles.buttonGroup}>
                <AppButton title="Editar" onPress={() => navigation.goBack()} />
                <AppButton title="Salvar" onPress={finalizarAgendamento} />
            </View>
        </ScrollView>
    );
    
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#343a40',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    detailLabel: {
        fontWeight: '600',
        color: '#495057',
    },
    detailValue: {
        color: '#212529',
    },
    buttonGroup: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    // Adicione outros estilos conforme necessário
});

export default Etapa6Agendamento;

