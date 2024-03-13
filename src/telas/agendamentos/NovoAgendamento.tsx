import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import Etapa1Agendamento from './Etapa1Agendamento';
import Etapa2Agendamento from './Etapa2Agendamento';
import Etapa3Agendamento from './Etapa3Agendamento';
import Etapa4Agendamento from './Etapa4Agendamento';
import Etapa5Agendamento from './Etapa5Agendamento';
import Etapa6Agendamento from './Etapa6Agendamento';
import { DadosEtapa1, DadosEtapa2, DadosEtapa3, DadosEtapa4, DadosEtapa5 } from '../../types/types';

import LinhaDoTempoAgendamento from './componentes/LinhaDoTempoAgendamento';
import CabeçalhoEtapa from './componentes/CabecalhoEtapa';
import { useAgendamento } from '../../context/AgendamentoContext';
import * as AgendamentoService from '../../services/AgendamentoService'; // Ajuste o caminho conforme necessário
import { useRoute } from '@react-navigation/native';
import { AgendamentoData } from '../../types';


const NovoAgendamento = () => {
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [dadosAgendamento, setDadosAgendamento] = useState<AgendamentoData>({} as AgendamentoData);
    const route = useRoute();
    const params = route.params as any;
    const { carregarDadosAgendamento } = useAgendamento();
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, limparDadosAgendamento } = useAgendamento();
    const { setEstaAvancando } = useAgendamento();

    const totalEtapas = 6;

    const combinarDadosDasEtapas = (dadosEtapa1: DadosEtapa1 | null, dadosEtapa2: DadosEtapa2 | null, dadosEtapa3: DadosEtapa3 | null, dadosEtapa4: DadosEtapa4 | null, dadosEtapa5: DadosEtapa5 | null): AgendamentoData => {
        // Supondo que dadosEtapa1, dadosEtapa2, etc., já estejam definidos no contexto
        const dadosCombinados: AgendamentoData = {
            // Etapa 1
            id: dadosEtapa1?.id || 0,
            datadacirurgia: dadosEtapa1?.dataSelecionada || '',
            horainicio: dadosEtapa1?.horarioInicio || '',
            duracao: dadosEtapa1?.duracao || '',
            hospitalId: dadosEtapa1?.hospitalId || 0,
            caraterprocedimento: dadosEtapa1?.caraterprocedimento || '',
            tipoprocedimento: dadosEtapa1?.tipoprocedimento || '',
            statusId: dadosEtapa1?.statusId || 0,
            cirurgioesId: dadosEtapa1?.cirurgioesSelecionados || [],
            SaladeCirurgiaId: dadosEtapa1?.salaDeCirurgiaId || undefined,
            setorId: dadosEtapa1?.setorId || undefined,
    
            // Etapa 2
            pacienteId: dadosEtapa2?.statusPaciente === 'Definitivo' ? dadosEtapa2?.pacienteId : undefined,
            pacienteProvisorioId: dadosEtapa2?.statusPaciente === 'Provisório' ? dadosEtapa2?.pacienteProvisorioId : undefined,
            statusPaciente: dadosEtapa2?.statusPaciente || 'Definitivo',
    
            // Etapa 3
            procedimentosId: dadosEtapa3?.procedimentosSelecionados || [],
            lateralidade: dadosEtapa3?.lateralidade || '',
            conveniosId: dadosEtapa3?.conveniosSelecionados || [],
            matricula: dadosEtapa3?.matricula || '',
    
            // Etapa 4
            grupodeanestesiaId: dadosEtapa4?.grupoDeAnestesiaSelecionado,
            anestesistaId: dadosEtapa4?.anestesistaSelecionado,
            utiPedida: dadosEtapa4?.utiPedida || false,
            utiConfirmada: dadosEtapa4?.utiConfirmada || false,
            hemoderivadosPedido: dadosEtapa4?.hemoderivadosPedido || false,
            hemoderivadosConfirmado: dadosEtapa4?.hemoderivadosConfirmado || false,
            apa: dadosEtapa4?.apa || false,
            tipoDeAcomodacao: dadosEtapa4?.tipoDeAcomodacao || '',
            mudancaDeAcomodacao: dadosEtapa4?.mudancaDeAcomodacao || false,
    
            // Etapa 5
            recursosComplementaresId: dadosEtapa5?.materiaisEspeciais || [],
            opmeId: dadosEtapa5?.opmesSelecionadas || [],
            fornecedoresId: dadosEtapa5?.fornecedoresSelecionados || [],
            instrumentaisId: dadosEtapa5?.instrumentaisSelecionados || [],
            fiosComQuantidade: dadosEtapa5?.fiosComQuantidade.map((fio) => ({
                id: fio.id,
                nome: fio.nome,
                AgendamentoFios: {
                    quantidadeNecessaria: fio.AgendamentoFios ? fio.AgendamentoFios.quantidadeNecessaria : 0,
                }
            })) || [], 
            // Campos adicionais para exibição (se necessário)
            cirurgioesNomes: [], // Preencher conforme necessário
            procedimentosNomes: [], // Preencher conforme necessário
            statusNome: '', // Preencher conforme necessário
            statusCor: '', // Preencher conforme necessário
    
            // Outros campos conforme necessário
            leito: dadosEtapa4?.leito || '',
            aviso: dadosEtapa4?.aviso || '',
            prontuario: dadosEtapa4?.prontuario || '',
            pacote: dadosEtapa4?.pacote || false,
            observacoes: dadosEtapa5?.observacoes || '',
        };
    
        console.log("Dados Combinados das Etapas:", dadosCombinados);
        return dadosCombinados;
    };
    
    
    const inicializarDadosAgendamento = (): AgendamentoData => {
        return {
            // Etapa 1
            datadacirurgia: '',
            horainicio: '',
            duracao: '',
            hospitalId: 0,
            caraterprocedimento: '',
            tipoprocedimento: '',
            statusId: 0,
            cirurgioesId: [],
            SaladeCirurgiaId: undefined,
            setorId: undefined,
    
            // Etapa 2
            pacienteId: undefined,
            pacienteProvisorioId: undefined,
            statusPaciente: 'Definitivo',
    
            // Etapa 3
            procedimentosId: [],
            lateralidade: '',
            conveniosId: [],
            matricula: '',
    
            // Etapa 4
            grupodeanestesiaId: undefined,
            anestesistaId: undefined,
            utiPedida: false,
            utiConfirmada: false,
            hemoderivadosPedido: false,
            hemoderivadosConfirmado: false,
            apa: false,
            leito: '',
            aviso: '',
            prontuario: '',
            pacote: false,
            tipoDeAcomodacao: '',
            mudancaDeAcomodacao: false,
    
            // Etapa 5 (se houver)
            recursosComplementaresId: [],
            opmeId: [],
            fornecedoresId: [],
            instrumentaisId: [],
            fiosComQuantidade: [],
    
            // Campos adicionais para exibição
            cirurgioesNomes: [],
            procedimentosNomes: [],
            statusNome: '',
            statusCor: '',
    
            // Outros campos
            observacoes: ''
        };
    };
    

    useEffect(() => {
        if (params && typeof params.agendamentoId === 'number' && !dadosCarregados) {
            AgendamentoService.obterAgendamentoPorId(params.agendamentoId)
                .then(response => {
                    console.log("Dados recebidos do serviço obterAgendamentoPorId:", response);

                    setDadosAgendamento(response);
                    carregarDadosAgendamento(response);
                    setDadosCarregados(true);
                })
                .catch(error => {
                    Alert.alert("Erro", "Não foi possível carregar os dados do agendamento.");
                });
        }
    }, [params, dadosCarregados, carregarDadosAgendamento]);
    
    
    const dadosMudaram = (novosDados: AgendamentoData, dadosAtuais: AgendamentoData) => {
        return (
            novosDados.pacienteId !== dadosAtuais.pacienteId ||
            novosDados.pacienteProvisorioId !== dadosAtuais.pacienteProvisorioId ||

            novosDados.anestesistaId !== dadosAtuais.anestesistaId ||
            novosDados.grupodeanestesiaId !== dadosAtuais.grupodeanestesiaId ||
            novosDados.hospitalId !== dadosAtuais.hospitalId ||
            novosDados.setorId !== dadosAtuais.setorId ||
            novosDados.statusId !== dadosAtuais.statusId ||
            novosDados.SaladeCirurgiaId !== dadosAtuais.SaladeCirurgiaId ||
            novosDados.horainicio !== dadosAtuais.horainicio ||
            novosDados.duracao !== dadosAtuais.duracao ||
            novosDados.utiPedida !== dadosAtuais.utiPedida ||
            novosDados.utiConfirmada !== dadosAtuais.utiConfirmada ||
            novosDados.hemoderivadosPedido !== dadosAtuais.hemoderivadosPedido ||
            novosDados.hemoderivadosConfirmado !== dadosAtuais.hemoderivadosConfirmado ||
            novosDados.apa !== dadosAtuais.apa ||
            novosDados.leito !== dadosAtuais.leito ||
            novosDados.aviso !== dadosAtuais.aviso ||
            novosDados.prontuario !== dadosAtuais.prontuario ||
            novosDados.lateralidade !== dadosAtuais.lateralidade ||
            novosDados.pacote !== dadosAtuais.pacote ||
            novosDados.tipoDeAcomodacao !== dadosAtuais.tipoDeAcomodacao ||
            novosDados.mudancaDeAcomodacao !== dadosAtuais.mudancaDeAcomodacao ||
            novosDados.datadacirurgia !== dadosAtuais.datadacirurgia ||
            JSON.stringify(novosDados.procedimentosId) !== JSON.stringify(dadosAtuais.procedimentosId) ||
            JSON.stringify(novosDados.cirurgioesId) !== JSON.stringify(dadosAtuais.cirurgioesId) ||
            JSON.stringify(novosDados.conveniosId) !== JSON.stringify(dadosAtuais.conveniosId) ||
            JSON.stringify(novosDados.recursosComplementaresId) !== JSON.stringify(dadosAtuais.recursosComplementaresId) ||
            JSON.stringify(novosDados.opmeId) !== JSON.stringify(dadosAtuais.opmeId) ||
            JSON.stringify(novosDados.fornecedoresId) !== JSON.stringify(dadosAtuais.fornecedoresId) ||
            JSON.stringify(novosDados.instrumentaisId) !== JSON.stringify(dadosAtuais.instrumentaisId) ||
            JSON.stringify(novosDados.fiosComQuantidade) !== JSON.stringify(dadosAtuais.fiosComQuantidade)
        );
    };


    useEffect(() => {
        const novosDados = combinarDadosDasEtapas(dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5);

        if (dadosMudaram(novosDados, dadosAgendamento)) {
            console.log("Atualizando dados do agendamento", novosDados);

            setDadosAgendamento(novosDados);
        }
    }, [dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, dadosAgendamento, dadosMudaram]);
   
        
        
        // Validação para a Etapa 1
        const validarDadosEtapa1 = (dados: DadosEtapa1 | null) => {
            if (!dados) {
                console.log("Validação da Etapa 1: dados são null");
                return false;
            }
        
            const isValid = dados.dataSelecionada && 
                            dados.horarioInicio && 
                            dados.duracao && 
                            dados.hospitalId && 
                            dados.statusId && 
                            dados.cirurgioesSelecionados.length > 0;
        
            console.log("Validação da Etapa 1:", isValid);
            return isValid;
        };
        

                // Validação para a Etapa 2
                const validarDadosEtapa2 = (dados: DadosEtapa2 | null) => {
                    console.log("Dados para validação da Etapa 2:", dados);

                    if (!dados) return false;
                    return dados.pacienteId !== 0;
                };

                const validarDadosEtapa3 = (dados: DadosEtapa3 | null) => {
                    if (!dados) {
                        console.log("Validação da Etapa 3: dados são null");
                        return false;
                    }
                
                    // Completa a expressão lógica e remove a referência direta ou indireta a 'isValid' em sua própria inicialização
                    const isValid = dados.procedimentosSelecionados.length > 0 &&
                                    dados.conveniosSelecionados.length > 0 &&
                                    dados.lateralidade !== '';
                
                    console.log("Validação da Etapa 3:", isValid);
                    return isValid;
                };

                // Validação para a Etapa 4
                const validarDadosEtapa4 = (dados: DadosEtapa4 | null) => {
                    if (!dados) return false;
                    return dados.grupoDeAnestesiaSelecionado !== null;
                };

                // Validação para a Etapa 5
                const validarDadosEtapa5 = (dados: DadosEtapa5 | null) => {
                    if (!dados) return false;
                    return dados.materiaisEspeciais.length > 0;
                };


   

        const validarEtapaAtual = () => {
            switch (etapaAtual) {
                case 1:
                    return validarDadosEtapa1(dadosEtapa1);
                case 2:
                    return validarDadosEtapa2(dadosEtapa2);
                case 3:
                    return validarDadosEtapa3(dadosEtapa3);
                case 4:
                    return validarDadosEtapa4(dadosEtapa4);
                case 5:
                    return validarDadosEtapa5(dadosEtapa5);
                default:
                    return true;
            }
        };
        
        
        const irParaProximaEtapa = () => {
            console.log(`Tentando avançar da Etapa ${etapaAtual} para a próxima.`);
            console.log("Dados atuais no contexto antes de avançar:", {
                dadosEtapa1,
                dadosEtapa2,
                dadosEtapa3,
                dadosEtapa4,
                dadosEtapa5,
                // Adicione mais conforme necessário
            });
            if (validarEtapaAtual()) {
                console.log(`Validação da Etapa ${etapaAtual} bem-sucedida. Avançando para a Etapa ${etapaAtual + 1}.`);

                setEstaAvancando(true); // Adicione esta linha

                if (etapaAtual < totalEtapas) {
                    setEtapaAtual(etapaAtual + 1);
                }
            } else {

                Alert.alert("Erro", `Por favor, corrija os erros na Etapa ${etapaAtual} antes de prosseguir.`);
            }
        };
        
        


        const irParaEtapaAnterior = () => {
            if (etapaAtual > 1) {
                console.log("Voltando para a etapa anterior");
                setEstaAvancando(false);
                setEtapaAtual(etapaAtual - 1);
            }
        };

        

    
    const renderizarEtapa = () => {
        switch (etapaAtual) {
            
            case 1:
                return <Etapa1Agendamento 
                           irParaProximaEtapa={irParaProximaEtapa} 
                           dadosIniciais={dadosAgendamento} // Passando os dados para a Etapa 1
                       />;
            case 2:
                return <Etapa2Agendamento irParaProximaEtapa={irParaProximaEtapa} irParaEtapaAnterior={irParaEtapaAnterior} />;
            case 3:
                return <Etapa3Agendamento irParaProximaEtapa={irParaProximaEtapa} irParaEtapaAnterior={irParaEtapaAnterior} />;
            case 4:
                return <Etapa4Agendamento irParaProximaEtapa={irParaProximaEtapa} irParaEtapaAnterior={irParaEtapaAnterior} />;
            case 5:
                return <Etapa5Agendamento irParaProximaEtapa={irParaProximaEtapa} irParaEtapaAnterior={irParaEtapaAnterior} />;
                case 6:
                return (
                    <Etapa6Agendamento 
                        dadosAgendamento={dadosAgendamento}
                        irParaEtapaAnterior={irParaEtapaAnterior}
                    />
                );
            default:
                    return <Text>Etapa desconhecida</Text>;
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <LinhaDoTempoAgendamento etapaAtual={etapaAtual} />
                <CabeçalhoEtapa 
                    etapaAtual={etapaAtual} 
                    totalEtapas={totalEtapas} 
                    irParaEtapaAnterior={irParaEtapaAnterior} 
                    irParaProximaEtapa={irParaProximaEtapa} 
                />
                <View style={styles.container}>
                    {renderizarEtapa()}
                </View>
            </ScrollView>
        </GlobalLayout>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    // Estilos adicionais conforme necessário
});

export default NovoAgendamento;
