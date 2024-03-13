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


interface Etapa6AgendamentoProps {
    dadosAgendamento: AgendamentoData;
    irParaEtapaAnterior: () => void;
  }


  const Etapa6Agendamento: React.FC<Etapa6AgendamentoProps> = ({ dadosAgendamento, irParaEtapaAnterior }) => {
    const navigation = useNavigation();
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, limparDadosAgendamento } = useContext(AgendamentoContext);
    const [detalhesAgendamento, setDetalhesAgendamento] = useState<Array<{ label: string, value: string }>>([]);
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
    
    
    

    

    const buscarNomesCirurgioes = async () => {
        try {
            // Certifique-se de que cirurgioesId está presente em dadosCombinados e é um array
            const cirurgioesId = dadosCombinados.cirurgioesSelecionados || [];
            const nomesCirurgioes = await Promise.all(
                cirurgioesId.map(async (id: number) => {
                    const cirurgiao = await CirurgiaoService.obterCirurgiaoPorId(id.toString());
                    return cirurgiao.nome;
                })
            );
            setNomesCirurgioes(nomesCirurgioes);
        } catch (error) {
            console.error("Erro ao buscar nomes dos cirurgiões:", error);
        }
    };


    const buscarNomesConvenios = async () => {
        try {
            const conveniosId = dadosCombinados.conveniosSelecionados || [];
            const nomesConvenios = await Promise.all(
                conveniosId.map(async (id) => {
                    const convenio = await ConvenioService.obterConvenioPorId(`${id}`);
                    return convenio.nome; // Supondo que o serviço retorne um objeto com a propriedade 'nome'
                })
            );
            setNomesConvenios(nomesConvenios);
        } catch (error) {
            console.error("Erro ao buscar nomes dos convênios:", error);
        }
    };

    const buscarNomesProcedimentos = async () => {
        try {
            const procedimentosId = dadosCombinados.procedimentosSelecionados || [];
            const nomesProcedimentos = await Promise.all(
                procedimentosId.map(async (id) => {
                    const procedimento = await ProcedimentoService.obterProcedimentoPorId(`${id}`);
                    return procedimento.nome; // Supondo que o serviço retorne um objeto com a propriedade 'nome'
                })
            );
            setNomesProcedimentos(nomesProcedimentos);
        } catch (error) {
            console.error("Erro ao buscar nomes dos procedimentos:", error);
        }
    };

    const buscarNomeHospital = async () => {
        if (dadosCombinados.hospitalId) {
            const hospital = await HospitalService.obterHospitalPorId(dadosCombinados.hospitalId.toString());
            console.log("Hospital:", hospital); // Adicione esta linha para depuração

            setNomeHospital(hospital.nomeHospital);
            console.log("Nome do Hospital atualizado:", hospital.nome); // Verifique se esta linha é exibida no log

        }
    };
    
    const buscarNomeAnestesista = async () => {
        if (dadosCombinados.anestesistaSelecionado) {
            const anestesista = await AnestesistaService.obterAnestesistaPorId(dadosCombinados.anestesistaSelecionado.toString());
            console.log("Anestesista:", anestesista); // Adicione esta linha para depuração

            setNomeAnestesista(anestesista.nomecompleto);
        }
    };
    

    useEffect(() => {
        buscarNomesCirurgioes();
        buscarNomesConvenios();
        buscarNomesProcedimentos();
        buscarNomeHospital();
        buscarNomeAnestesista();
    }, []);

    

    return (
        <ScrollView style={styles.container}>
        <Text style={styles.title}>Detalhes do Agendamento</Text>
        <View style={styles.card}>
            {nomesCirurgioes.length > 0 && (
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Cirurgiões:</Text>
                    <Text style={styles.detailValue}>{nomesCirurgioes.join(', ')}</Text>
                </View>
            )}
            {nomesConvenios.length > 0 && ( // Adiciona esta verificação e exibição para os convênios
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Convênios:</Text>
                    <Text style={styles.detailValue}>{nomesConvenios.join(', ')}</Text>
                </View>
            )}
            {nomesProcedimentos.length > 0 && ( // Adiciona esta verificação e exibição para os procedimentos
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Procedimentos:</Text>
                    <Text style={styles.detailValue}>{nomesProcedimentos.join(', ')}</Text>
                </View>
            )}
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hospital:</Text>
                <Text style={styles.detailValue}>{nomeHospital}</Text>
            </View>
            
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Anestesista:</Text>
                <Text style={styles.detailValue}>{nomeAnestesista}</Text>
            </View>


            {/* Repita para outros detalhes do agendamento */}
        </View>
            <View style={styles.buttonGroup}>
                <AppButton title="Editar" onPress={() => navigation.goBack()} />
                <AppButton title="Salvar e Finalizar" onPress={finalizarAgendamento} />
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

