import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as CirurgiaoService from '../../services/CirurgiaoService';
import * as AnestesistaService from '../../services/AnestesistaService';
import * as ProcedimentoService from '../../services/ProcedimentoService';
import * as ConvenioService from '../../services/ConvenioService';
import * as RecursoComplementarService from '../../services/RecursoComplementarService';
import * as OPMEService from '../../services/OPMEService';
import * as FornecedorService from '../../services/FornecedorService';
import AppButton from '../../componentes/Botões/AppButton';
import { useNavigation } from '@react-navigation/native';
import AgendamentoContext from '../../context/AgendamentoContext';
import * as AgendamentoService from '../../services/AgendamentoService';

interface DadosAgendamento {
    id: number;
    cirurgioes: number[];
    anestesistaId: number;
    procedimentos: number[];
    convenios: number[];
    recursosComplementaresId: number[];
    opmeId: number[];
    fornecedoresId: number[];
    // Adicione outros campos conforme necessário
    Paciente: { nomecompleto: string };
    GrupoDeAnestesia: { nome: string };
    // ... outros campos conforme necessário
}

const Etapa6Agendamento = ({ dadosAgendamento }: { dadosAgendamento: DadosAgendamento }) => {
    const [nomesCirurgioes, setNomesCirurgioes] = useState<string[]>([]);
    const [nomeAnestesista, setNomeAnestesista] = useState('');
    const [nomesProcedimentos, setNomesProcedimentos] = useState<string[]>([]);
    const [nomesConvenios, setNomesConvenios] = useState<string[]>([]);
    const [nomesRecursosComplementares, setNomesRecursosComplementares] = useState<string[]>([]);
    const [descricoesOpme, setDescricoesOpme] = useState<string[]>([]);
    const [nomesFornecedores, setNomesFornecedores] = useState<string[]>([]);
    const navigation = useNavigation();
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, limparDadosAgendamento } = useContext(AgendamentoContext);

    const finalizarAgendamento = async () => {
        try {
            const dadosCompletos = {
                ...dadosEtapa1,
                ...dadosEtapa2,
                ...dadosEtapa3,
                ...dadosEtapa4,
                ...dadosEtapa5,
                cirurgioes: dadosAgendamento.cirurgioes,
            anestesistaId: dadosAgendamento.anestesistaId,
            procedimentos: dadosAgendamento.procedimentos,
            convenios: dadosAgendamento.convenios,
            recursosComplementaresId: dadosAgendamento.recursosComplementaresId,
            opmeId: dadosAgendamento.opmeId,
            fornecedoresId: dadosAgendamento.fornecedoresId,
            horainicio: dadosEtapa1?.horarioInicio || '',
            datadacirurgia: dadosEtapa1?.dataSelecionada || '',
            // Adicione outros campos conforme necessário
            statusId: dadosEtapa1?.statusId || 0,
            hospitalId: dadosEtapa1?.hospitalId || 0,
            setorId: dadosEtapa1?.setorId || null,
            salaDeCirurgiaId: dadosEtapa1?.salaDeCirurgiaId || null,
            pacienteId: dadosEtapa2?.pacienteId || 0,
            lateralidade: dadosEtapa3?.lateralidade || '',
            planoId: dadosEtapa3?.planoId || null,
            matricula: dadosEtapa3?.matricula || '',
            utiPedida: dadosEtapa4?.utiPedida || false,
            utiConfirmada: dadosEtapa4?.utiConfirmada || false,
            hemoderivadosPedido: dadosEtapa4?.hemoderivadosPedido || false,
            hemoderivadosConfirmado: dadosEtapa4?.hemoderivadosConfirmado || false,
            apa: dadosEtapa4?.apa || false,
leito: dadosEtapa4?.leito || '',
aviso: dadosEtapa4?.aviso || '',
prontuario: dadosEtapa4?.prontuario || '',
pacote: dadosEtapa4?.pacote || false,
grupoDeAnestesiaSelecionado: dadosEtapa4?.grupoDeAnestesiaSelecionado || null,
materiaisEspeciais: dadosEtapa5?.materiaisEspeciais || [],
// Outros campos de DadosEtapa5 conforme necessário
};

            await AgendamentoService.criarAgendamento(dadosCompletos);
            Alert.alert('Sucesso', 'Agendamento salvo com sucesso!');
            limparDadosAgendamento();
            navigation.navigate('TelaDeSucesso'); // Substitua pela tela desejada
        } catch (error) {
        Alert.alert('Falha ao salvar o agendamento', error instanceof Error ? error.message : String(error));
        }
        };
        
        const buscarNomesCirurgioes = async () => {
            const nomes = await Promise.all(
                dadosAgendamento.cirurgioes.map(async (id) => {
                    const cirurgiao = await CirurgiaoService.obterCirurgiaoPorId(String(id));
                    return cirurgiao.nome;
                })
            );
            setNomesCirurgioes(nomes);
        };
        
        const buscarNomeAnestesista = async () => {
            const anestesista = await AnestesistaService.obterAnestesistaPorId(String(dadosAgendamento.anestesistaId));
            setNomeAnestesista(anestesista.nomecompleto);
        };
        
        const buscarNomesProcedimentos = async () => {
            const nomes = await Promise.all(
                dadosAgendamento.procedimentos.map(async (id) => {
                    const procedimento = await ProcedimentoService.obterProcedimentoPorId(String(id));
                    return procedimento.nome;
                })
            );
            setNomesProcedimentos(nomes);
        };
        
        const buscarNomesConvenios = async () => {
            const nomes = await Promise.all(
                dadosAgendamento.convenios.map(async (id) => {
                    const convenio = await ConvenioService.obterConvenioPorId(String(id));
                    return convenio.nome;
                })
            );
            setNomesConvenios(nomes);
        };
        
        const buscarNomesRecursosComplementares = async () => {
            const nomes = await Promise.all(
                dadosAgendamento.recursosComplementaresId.map(async (id) => {
                    const recurso = await RecursoComplementarService.obterRecursoComplementarPorId(String(id));
                    return recurso.nome;
                })
            );
            setNomesRecursosComplementares(nomes);
        };
        
        const buscarDescricoesOpme = async () => {
            const descricoes = await Promise.all(
                dadosAgendamento.opmeId.map(async (id) => {
                    const opme = await OPMEService.obterOPMEPorId(String(id));
                    return opme.descricao;
                })
            );
            setDescricoesOpme(descricoes);
        };
        
        const buscarNomesFornecedores = async () => {
            const nomes = await Promise.all(
                dadosAgendamento.fornecedoresId.map(async (id) => {
                    const fornecedor = await FornecedorService.obterFornecedorPorId(String(id));
                    return fornecedor.nome;
                })
            );
            setNomesFornecedores(nomes);
        };
        
        useEffect(() => {
            buscarNomesCirurgioes();
            buscarNomeAnestesista();
            buscarNomesProcedimentos();
            buscarNomesConvenios();
            buscarNomesRecursosComplementares();
            buscarDescricoesOpme();
            buscarNomesFornecedores();
        }, [dadosAgendamento]);
        
            // Continuação da função Etapa6Agendamento
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Detalhes do Agendamento</Text>

            <View style={styles.card}>
                <DetailRow label="Paciente" value={dadosAgendamento.Paciente.nomecompleto} />
                <DetailRow label="Anestesista" value={nomeAnestesista} />
                <DetailRow label="Grupo de Anestesia" value={dadosAgendamento.GrupoDeAnestesia.nome} />
                <DetailRow label="Cirurgiões" value={nomesCirurgioes.join(', ')} />
                <DetailRow label="Procedimentos" value={nomesProcedimentos.join(', ')} />
                <DetailRow label="Convênios" value={nomesConvenios.join(', ')} />
                <DetailRow label="Recursos Complementares" value={nomesRecursosComplementares.join(', ')} />
                <DetailRow label="OPMEs" value={descricoesOpme.join(', ')} />
                <DetailRow label="Fornecedores" value={nomesFornecedores.join(', ')} />
                {/* ... Outros detalhes do agendamento */}
            </View>

            <View style={styles.buttonGroup}>
                <AppButton title="Editar" onPress={() => navigation.goBack()} />
                <AppButton title="Salvar e Finalizar" onPress={finalizarAgendamento} />
            </View>
        </ScrollView>
    );
};

// Componente auxiliar para renderizar cada linha de detalhe
const DetailRow = ({ label, value }: { label: string, value: string | undefined }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value || 'Não informado'}</Text>
    </View>
);

// Estilos do componente
// Estilos do componente
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

