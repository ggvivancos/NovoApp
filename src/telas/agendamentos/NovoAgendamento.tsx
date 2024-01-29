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

    const combinarDadosDasEtapas = (
        etapa1: DadosEtapa1 | null,
        etapa2: DadosEtapa2 | null,
        etapa3: DadosEtapa3 | null,
        etapa4: DadosEtapa4 | null,
        etapa5: DadosEtapa5 | null
    ): AgendamentoData => {
        
        const dadosCombinados = {
            // Etapa 1
            datadacirurgia: etapa1?.dataSelecionada || '',
            horainicio: etapa1?.horarioInicio || '',
            duracao: etapa1?.duracao || '',
            hospitalId: etapa1?.hospitalId || 0,
            caraterprocedimento: etapa1?.caraterprocedimento || '',
            tipoprocedimento: etapa1?.tipoprocedimento || '',
            statusId: etapa1?.statusId || 0,
            cirurgioesId: etapa1?.cirurgioesSelecionados || [],
    
            // Etapa 2
            pacienteId: etapa2?.statusPaciente === 'Definitivo' ? etapa2?.pacienteId : undefined,
            pacienteProvisorioId: etapa2?.statusPaciente === 'Provisório' ? etapa2?.pacienteProvisorioId : undefined,
            statusPaciente: etapa2?.statusPaciente || 'Definitivo',
    
            // Etapa 3
            procedimentosId: etapa3?.procedimentosSelecionados || [],
            lateralidade: etapa3?.lateralidade || '',
            conveniosId: etapa3?.conveniosSelecionados || [],
            matricula: etapa3?.matricula || '',
    
            // Etapa 4
            grupodeanestesiaId: etapa4?.grupoDeAnestesiaSelecionado,
            anestesistaId: etapa4?.anestesistaSelecionado,
            utiPedida: etapa4?.utiPedida || false,
            utiConfirmada: etapa4?.utiConfirmada || false,
            hemoderivadosPedido: etapa4?.hemoderivadosPedido || false,
            hemoderivadosConfirmado: etapa4?.hemoderivadosConfirmado || false,
            apa: etapa4?.apa || false,
    
            // Etapa 5
            recursosComplementaresId: etapa5?.materiaisEspeciais || [],
            opmeId: etapa5?.opmesSelecionadas || [],
            fornecedoresId: etapa5?.fornecedoresSelecionados || [],
    
            // Campos adicionais para exibição (se necessário)
            cirurgioesNomes: [], // Preencher conforme necessário
            procedimentosNomes: [], // Preencher conforme necessário
            statusNome: '', // Preencher conforme necessário
            statusCor: '', // Preencher conforme necessário
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
    
            // Etapa 5 (se houver)
            recursosComplementaresId: [],
            opmeId: [],
            fornecedoresId: [],
    
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
                    setDadosAgendamento(response);
                    carregarDadosAgendamento(response);
                    setDadosCarregados(true);
                })
                .catch(error => {
                    console.error("Erro ao carregar dados do agendamento:", error);
                    Alert.alert("Erro", "Não foi possível carregar os dados do agendamento.");
                });
        }
    }, [params, dadosCarregados, carregarDadosAgendamento]);
    
    
    useEffect(() => {
        if ((!params || typeof params.agendamentoId !== 'number') && !dadosCarregados) {
            limparDadosAgendamento();
            setDadosAgendamento(inicializarDadosAgendamento());
            setEtapaAtual(1);
            setDadosCarregados(true);
        }
    }, [params, dadosCarregados, limparDadosAgendamento]);
    
    
    
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
                novosDados.datadacirurgia !== dadosAtuais.datadacirurgia ||
                JSON.stringify(novosDados.procedimentosId) !== JSON.stringify(dadosAtuais.procedimentosId) ||
                JSON.stringify(novosDados.cirurgioesId) !== JSON.stringify(dadosAtuais.cirurgioesId) ||
                JSON.stringify(novosDados.conveniosId) !== JSON.stringify(dadosAtuais.conveniosId) ||
                JSON.stringify(novosDados.recursosComplementaresId) !== JSON.stringify(dadosAtuais.recursosComplementaresId) ||
                JSON.stringify(novosDados.opmeId) !== JSON.stringify(dadosAtuais.opmeId) ||
                JSON.stringify(novosDados.fornecedoresId) !== JSON.stringify(dadosAtuais.fornecedoresId)
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

                // Validação para a Etapa 3
                const validarDadosEtapa3 = (dados: DadosEtapa3 | null) => {
                    if (!dados) return false;
                    return dados.procedimentosSelecionados.length > 0;
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
            console.log("Validando Etapa Atual:", etapaAtual);
            console.log("Dados da Etapa 1 para validação:", dadosEtapa1);
            if (validarEtapaAtual()) {
                console.log("Avançando para a próxima etapa");

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
