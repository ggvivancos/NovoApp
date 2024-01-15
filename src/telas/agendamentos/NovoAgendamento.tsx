import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import GlobalLayout from '../../layouts/GlobalLayout';
import Etapa1Agendamento from './Etapa1Agendamento';
import Etapa2Agendamento from './Etapa2Agendamento';
import Etapa3Agendamento from './Etapa3Agendamento';
import Etapa4Agendamento from './Etapa4Agendamento';
import Etapa5Agendamento from './Etapa5Agendamento';
import Etapa6Agendamento from './Etapa6Agendamento';

import LinhaDoTempoAgendamento from './componentes/LinhaDoTempoAgendamento';
import CabeçalhoEtapa from './componentes/CabecalhoEtapa';
import { useAgendamento } from '../../context/AgendamentoContext';
import * as AgendamentoService from '../../services/AgendamentoService'; // Ajuste o caminho conforme necessário
import { useRoute } from '@react-navigation/native';


const NovoAgendamento = () => {
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [dadosAgendamento, setDadosAgendamento] = useState({});
    const route = useRoute();
    const params = route.params as any;
    const { carregarDadosAgendamento } = useAgendamento();
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, limparDadosAgendamento } = useAgendamento();


    


    useEffect(() => {

        
        // Carregar dados do agendamento se estiver editando um existente
        if (params && typeof params.agendamentoId === 'number' && !dadosCarregados) {
            AgendamentoService.obterAgendamentoPorId(params.agendamentoId)
                .then(response => {
                    setDadosAgendamento(response);
                    carregarDadosAgendamento(response);
                    console.log("Dados do agendamento carregados:", response); // Log adicionado aqui

                    setDadosCarregados(true);
                })
                .catch(error => {
                    console.error("Erro ao carregar dados do agendamento:", error);
                    Alert.alert("Erro", "Não foi possível carregar os dados do agendamento.");
                });
        }
    }, [params, carregarDadosAgendamento]);
    
    useEffect(() => {
        // Limpar dados do agendamento se estiver começando um novo
        if ((!params || typeof params.agendamentoId !== 'number') && !dadosCarregados) {
            console.log("Iniciando um novo agendamento, limpando dados anteriores"); // Log adicionado aqui
           
            limparDadosAgendamento();
            setDadosAgendamento({});
            setEtapaAtual(1);
            setDadosCarregados(true); // Evita redefinições indesejadas
        }
    }, [params, limparDadosAgendamento]);

    


   

    const totalEtapas = 6;


    const irParaProximaEtapa = () => {
        if (etapaAtual < totalEtapas) {
            console.log(`Avançando da Etapa ${etapaAtual} para Etapa ${etapaAtual + 1}`); // Log adicionado aqui

            setEtapaAtual(etapaAtual + 1);
        }
    };

    const irParaEtapaAnterior = () => {
        if (etapaAtual > 1) {
            console.log(`Retornando da Etapa ${etapaAtual} para Etapa ${etapaAtual - 1}`);
            setEtapaAtual(etapaAtual - 1);
        }
    };

    const finalizarAgendamento = () => {
        
        

        console.log("Dados Etapa 1:", dadosEtapa1);
        console.log("Dados Etapa 2:", dadosEtapa2);
        console.log("Dados Etapa 3:", dadosEtapa3);
        console.log("Dados Etapa 4:", dadosEtapa4);
        console.log("Dados Etapa 5:", dadosEtapa5);


        if (!dadosEtapa1 || !dadosEtapa2 || !dadosEtapa3 || !dadosEtapa4 || !dadosEtapa5) {
            Alert.alert("Erro", "Dados incompletos para o agendamento.");
            return;
        }
        
        const sairDoAgendamento = () => {
        limparDadosAgendamento();
        };
        // Compilando todos os dados das etapas em um objeto único
        const dadosAgendamentoCompleto = {
            pacienteId: dadosEtapa2?.pacienteId ?? 0,
            anestesistaId: dadosEtapa4?.anestesistaSelecionado ?? 0, // Ajuste conforme a etapa correta
            grupodeanestesiaId: dadosEtapa4?.grupoDeAnestesiaSelecionado ?? 0, // Ajuste conforme a etapa correta
            horainicio: dadosEtapa1?.horarioInicio ?? '',
            duracao: dadosEtapa1?.duracao ?? '',
            utiPedida: dadosEtapa4?.utiPedida ?? false,
            utiConfirmada: dadosEtapa4?.utiConfirmada ?? false,
            hemoderivadosPedido: dadosEtapa4?.hemoderivadosPedido ?? false,
            hemoderivadosConfirmado: dadosEtapa4?.hemoderivadosConfirmado ?? false,
            apa: dadosEtapa4?.apa ?? false,
            leito: dadosEtapa4?.leito ?? '',
            aviso: dadosEtapa4?.aviso ?? '', // Verifique se está na etapa correta
            prontuario: dadosEtapa4?.prontuario ?? '', // Verifique se está na etapa correta
            lateralidade: dadosEtapa3?.lateralidade ?? '',
            pacote: dadosEtapa4?.pacote ?? false,
            datadacirurgia: dadosEtapa1?.dataSelecionada ?? '',
            procedimentos: dadosEtapa3?.procedimentosSelecionados ?? [],
            cirurgioes: dadosEtapa1?.cirurgioesSelecionados ?? [],
            convenios: dadosEtapa3?.conveniosSelecionados ?? [],
            recursosComplementaresId: dadosEtapa5?.materiaisEspeciais ?? [], // Verifique se está na etapa correta
            opmeId: dadosEtapa5?.opmesSelecionadas ?? [], // Ajuste conforme a etapa correta
            fornecedoresId: dadosEtapa5?.fornecedoresSelecionados ?? [], // Ajuste conforme a etapa correta
            statusId: dadosEtapa1?.statusId ?? 1, // Usando o statusId da Etapa1
            observacao: 'Nenhuma observação', // Substitua por um valor apropriado
            hospitalId: dadosEtapa1?.hospitalId ?? 1, // Substitua por um valor apropriado
            setorId: dadosEtapa1?.setorId ?? undefined,
            salaDeCirurgiaId: dadosEtapa1?.salaDeCirurgiaId ?? null, // Substitua por um valor apropriado
        };
        
        
        setDadosAgendamento(dadosAgendamentoCompleto);

        
        setEtapaAtual(6);

        AgendamentoService.criarAgendamento(dadosAgendamentoCompleto)
            .then(response => {
                console.log("Resposta do servidor:", response);

                Alert.alert("Agendamento Finalizado", "Seu agendamento foi concluído com sucesso.");
                limparDadosAgendamento(); // Limpa os dados após o sucesso


                // Navegação opcional após a finalização
                // navigation.navigate('TelaDeSucesso');
            })
            .catch(error => {
                console.error("Erro ao criar agendamento:", error);
                Alert.alert("Erro", "Não foi possível criar o agendamento. Tente novamente.");
            });
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
                            finalizarAgendamento={finalizarAgendamento}
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
