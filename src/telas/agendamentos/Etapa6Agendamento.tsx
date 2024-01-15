import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Share, ScrollView } from 'react-native';
import * as CirurgiaoService from '../../services/CirurgiaoService';
import * as AnestesistaService from '../../services/AnestesistaService';
import * as ProcedimentoService from '../../services/ProcedimentoService';
import * as ConvenioService from '../../services/ConvenioService';
import * as RecursoComplementarService from '../../services/RecursoComplementarService';
import * as OPMEService from '../../services/OPMEService';
import * as FornecedorService from '../../services/FornecedorService';
import AppButton from '../../componentes/Botões/AppButton';
import { useNavigation } from '@react-navigation/native';

interface Etapa6Props {
    dadosAgendamento: any; // Substitua 'any' pelo tipo apropriado, se necessário
    finalizarAgendamento: () => void;
    irParaEtapaAnterior: () => void;
}

const Etapa6Agendamento = ({ dadosAgendamento }) => {
    const [nomesCirurgioes, setNomesCirurgioes] = useState<string[]>([]);
    const [nomeAnestesista, setNomeAnestesista] = useState('');
    const [nomesProcedimentos, setNomesProcedimentos] = useState<string[]>([]);
    const [nomesConvenios, setNomesConvenios] = useState<string[]>([]);
    const [nomesRecursosComplementares, setNomesRecursosComplementares] = useState<string[]>([]);
    const [descricoesOpme, setDescricoesOpme] = useState<string[]>([]);
    const [nomesFornecedores, setNomesFornecedores] = useState<string[]>([]);
    const navigation = useNavigation();
    
    const voltarParaEdicao = () => {
        if (dadosAgendamento && dadosAgendamento.id) {
            (navigation as any).navigate('NovoAgendamento', { agendamentoId: dadosAgendamento.id });
        } else {
            console.error('Erro: ID do agendamento não encontrado.');
        }
    };
    const handleBack = () => {
        navigation.goBack();
    };
    // Adicione mais estados conforme necessário

    useEffect(() => {

        console.log("Dados recebidos na Etapa6:", dadosAgendamento);


        const buscarNomesCirurgioes = async () => {
            if (dadosAgendamento.cirurgioes && dadosAgendamento.cirurgioes.length > 0) {
                const nomes = await Promise.all(
                    dadosAgendamento.cirurgioes.map(async (id) => {
                        const cirurgiao = await CirurgiaoService.obterCirurgiaoPorId(id.toString());
                        return cirurgiao.nome;
                    })
                );
                setNomesCirurgioes(nomes);
            }
        };
    
        const buscarNomeAnestesista = async () => {
            if (dadosAgendamento.anestesistaId) {
                const anestesista = await AnestesistaService.obterAnestesistaPorId(dadosAgendamento.anestesistaId.toString());
                setNomeAnestesista(anestesista.nomecompleto);
            }
        };

        const buscarNomesProcedimentos = async () => {
            if (dadosAgendamento.procedimentos && dadosAgendamento.procedimentos.length > 0) {
                const nomes = await Promise.all(
                    dadosAgendamento.procedimentos.map(async (
    id) => {
    const procedimento = await ProcedimentoService.obterProcedimentoPorId(id.toString());
    return procedimento.nome;
    })
    );
    setNomesProcedimentos(nomes);
    }
    };

    const buscarNomesConvenios = async () => {
        if (dadosAgendamento.convenios && dadosAgendamento.convenios.length > 0) {
            const nomes = await Promise.all(
                dadosAgendamento.convenios.map(async (id) => {
                    const convenio = await ConvenioService.obterConvenioPorId(id.toString());
                    return convenio.nome;
                })
            );
            setNomesConvenios(nomes);
        }
    };
    
    const buscarNomesRecursosComplementares = async () => {
        if (dadosAgendamento.recursosComplementaresId && dadosAgendamento.recursosComplementaresId.length > 0) {
            const nomes = await Promise.all(
                dadosAgendamento.recursosComplementaresId.map(async (id) => {
                    const recurso = await RecursoComplementarService.obterRecursoComplementarPorId(id.toString());
                    return recurso.nome;
                })
            );
            setNomesRecursosComplementares(nomes);
        }
    };
    
    const buscarDescricoesOpme = async () => {
        if (dadosAgendamento.opmeId && dadosAgendamento.opmeId.length > 0) {
            const descricoes = await Promise.all(
                dadosAgendamento.opmeId.map(async (id) => {
                    const opme = await OPMEService.obterOPMEPorId(id.toString());
                    return opme.descricao;
                })
            );
            setDescricoesOpme(descricoes);
        }
    };
    
    const buscarNomesFornecedores = async () => {
        if (dadosAgendamento.fornecedoresId && dadosAgendamento.fornecedoresId.length > 0) {
            const nomes = await Promise.all(
                dadosAgendamento.fornecedoresId.map(async (id) => {
                    const fornecedor = await FornecedorService.obterFornecedorPorId(id.toString());
                    return fornecedor.nome;
                })
            );
           
    setNomesFornecedores(nomes);
    }
    };
        // Chame as funções de busca
        buscarNomesCirurgioes();
        buscarNomeAnestesista();
        buscarNomesProcedimentos();
        buscarNomesConvenios();
        buscarNomesRecursosComplementares();
        buscarDescricoesOpme();
        buscarNomesFornecedores();
        }, [dadosAgendamento]);
        
      
    // Implementação das funções voltarParaEdicao e compartilharAgendamento
    

    const compartilharAgendamento = async () => {
        try {
            const message = `Detalhes do Agendamento:\nData da Cirurgia: ${formatarData(dadosAgendamento.datadacirurgia)}\n...`; // Adicione mais detalhes conforme necessário
            await Share.share({
                message,
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleDateString();
    };


   return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Detalhes do Agendamento</Text>

            <View style={styles.card}>
                <DetailRow label="Paciente" value={dadosAgendamento.Paciente?.nomecompleto} />
                <DetailRow label="Anestesista" value={nomeAnestesista} />
                <DetailRow label="Grupo de Anestesia" value={dadosAgendamento.GrupoDeAnestesia?.nome} />
                <DetailRow label="Cirurgiões" value={nomesCirurgioes.join(', ')} />
                <DetailRow label="Procedimentos" value={nomesProcedimentos.join(', ')} />
                <DetailRow label="Convênios" value={nomesConvenios.join(', ')} />
                <DetailRow label="Recursos Complementares" value={nomesRecursosComplementares.join(', ')} />
                <DetailRow label="OPMEs" value={descricoesOpme.join(', ')} />
                <DetailRow label="Fornecedores" value={nomesFornecedores.join(', ')} />
                {/* ... Outros detalhes do agendamento */}
            </View>

            <View style={styles.buttonGroup}>
                <AppButton title="Editar" onPress={voltarParaEdicao} />
                <AppButton title="Finalizar" onPress={handleBack} />
            </View>
        </ScrollView>
    );
};

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value || 'Não informado'}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 24,
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
    // Outros estilos conforme necessário
});

export default Etapa6Agendamento;
