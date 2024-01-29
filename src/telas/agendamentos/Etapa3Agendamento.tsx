import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import ModalCheckBox from '../../componentes/models/ModalCheckBox';
import ModalModelo from '../../componentes/models/ModalModelo';
import * as ProcedimentoService from '../../services/ProcedimentoService';
import * as ConvenioService from '../../services/ConvenioService';
import { useAgendamento } from '../../context/AgendamentoContext';
import { DadosEtapa3 } from '../../types/types';


interface Etapa3Props {
    irParaProximaEtapa: () => void;
    irParaEtapaAnterior: () => void;
}



interface Plano {
    id: number;
    nome: string;
}

const Etapa3Agendamento: React.FC<Etapa3Props> = ({ irParaProximaEtapa, irParaEtapaAnterior }) => {
    const navigation = useNavigation();
    const [procedimentos, setProcedimentos] = useState<any[]>([]);
    const [convenios, setConvenios] = useState<any[]>([]);
    const [procedimentosSelecionados, setProcedimentosSelecionados] = useState<any[]>([]);
    const [conveniosSelecionados, setConveniosSelecionados] = useState<any[]>([]);
    const [lateralidade, setLateralidade] = useState('');
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [matricula, setMatricula] = useState('');
    const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);
    const [mostrarModalProcedimentos, setMostrarModalProcedimentos] = useState(false);
    const [mostrarModalConvenios, setMostrarModalConvenios] = useState(false);
    const [mostrarModalPlano, setMostrarModalPlano] = useState(false);
    const { dadosEtapa2, dadosEtapa3, salvarDadosEtapa3} = useAgendamento();
    const { limparDadosAgendamento } = useAgendamento();

    const cancelarAgendamento = () => {
        Alert.alert(
            "Cancelar Agendamento",
            "Tem certeza de que deseja cancelar o agendamento?",
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                { 
                    text: "Sim", 
                    onPress: () => {
                        limparDadosAgendamento();
                        navigation.goBack(); // Ou navegue para a tela desejada
                    }
                }
            ]
        );
    };


    useEffect(() => {
        // Verifica se há dados salvos para a Etapa 3 no contexto
        if (dadosEtapa3) {
            // Atualiza os estados locais com os dados salvos
            setProcedimentosSelecionados(dadosEtapa3.procedimentosSelecionados);
            setConveniosSelecionados(dadosEtapa3.conveniosSelecionados);
            setLateralidade(dadosEtapa3.lateralidade);
            setMatricula(dadosEtapa3.matricula);
    
            // Para o plano, você precisa encontrar o plano correspondente pelo ID
            const planoEncontrado = planos.find(plano => plano.id === dadosEtapa3.planoId);
            if (planoEncontrado) {
                setPlanoSelecionado(planoEncontrado);
            }
        }
    }, [dadosEtapa3, planos]);
    
    
    

const salvarEtapa3 = () => {
    const dadosEtapa3: DadosEtapa3 = {
        procedimentosSelecionados,
        conveniosSelecionados,
        lateralidade,
        planoId: planoSelecionado?.id || null,
        matricula
        // Adicione mais campos conforme necessário
    };

    salvarDadosEtapa3(dadosEtapa3);
    irParaProximaEtapa(); // Ou navegue para a próxima etapa conforme necessário
};

    useEffect(() => {
        ProcedimentoService.obterProcedimentos().then(response => {
            setProcedimentos(response.data);
        }).catch(error => {
            console.error('Erro ao buscar procedimentos:', error);
        });

        ConvenioService.obterConvenios().then(response => {
            setConvenios(response.data);
        }).catch(error => {
            console.error('Erro ao buscar convênios:', error);
        });
    }, []);

    const selecionarProcedimento = (id: number) => {
        const jaSelecionado = procedimentosSelecionados.includes(id);
        if (jaSelecionado) {
            setProcedimentosSelecionados(procedimentosSelecionados.filter(item => item !== id));
        } else {
            setProcedimentosSelecionados([...procedimentosSelecionados, id]);
        }
    };

    const selecionarConvenio = (id: number) => {
        const jaSelecionado = conveniosSelecionados.includes(id);
        if (jaSelecionado) {
            setConveniosSelecionados(conveniosSelecionados.filter(item => item !== id));
        } else {
            setConveniosSelecionados([...conveniosSelecionados, id]);
        }
    };

    const selecionarLateralidade = (valor: React.SetStateAction<string>) => {
        setLateralidade(valor);
    };

    const selecionarPlano = (planoId: number) => {
        const planoEncontrado = planos.find(plano => plano.id === planoId);
        if (planoEncontrado) {
            setPlanoSelecionado(planoEncontrado);
        }
        setMostrarModalPlano(false);
    };

    const renderProcedimentoBox = (id: number) => {
        const procedimento = procedimentos.find(p => p.id === id);
        if (!procedimento || !procedimento.codigoTUSS || !procedimento.nome) {
            return null;
        }
        return (
            <View key={id} style={styles.itemBox}>
                <Text style={styles.itemBoxText}>{`${procedimento?.codigoTUSS} - ${procedimento?.nome}`}</Text>
                <TouchableOpacity onPress={() => selecionarProcedimento(id)} style={styles.itemBoxRemove}>
                    <Text style={styles.itemBoxRemoveText}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderConvenioBox = (id: number) => {
        const convenio = convenios.find(c => c.id === id);
        return (
            <View key={id} style={styles.itemBox}>
                <Text style={styles.itemBoxText}>{convenio?.nome}</Text>
                <TouchableOpacity onPress={() => selecionarConvenio(id)} style={styles.itemBoxRemove}>
                    <Text style={styles.itemBoxRemoveText}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };

       
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.label}>Procedimentos</Text>
                    <TouchableOpacity 
                        onPress={() => setMostrarModalProcedimentos(true)} 
                        style={styles.inputSelector}
                    >
                        <View style={styles.itemsContainer}>
                            {procedimentosSelecionados.map(renderProcedimentoBox)}
                        </View>
                    </TouchableOpacity>
    
                    <ModalCheckBox
                        isVisible={mostrarModalProcedimentos}
                        onDismiss={() => setMostrarModalProcedimentos(false)}
                        onItemSelected={selecionarProcedimento}
                        items={procedimentos.map(procedimento => ({
                            id: procedimento.id,
                            label: `${procedimento.codigoTUSS} - ${procedimento.nome}`
                        }))}
                        selectedItems={procedimentosSelecionados}
                        title="Selecione os Procedimentos"
                    />
    
    <View style={styles.lateralidadeOpcoes}>
    {['Direita', 'Esquerda', 'Bilateral', 'Não se Aplica'].map((opcao) => (
        <TouchableOpacity
            key={opcao}
            style={[
                styles.lateralidadeOpcao,
                lateralidade === opcao && styles.lateralidadeOpcaoSelecionada
            ]}
            onPress={() => selecionarLateralidade(opcao)}
        >
            <Text style={[
                styles.lateralidadeTexto,
                lateralidade === opcao && styles.lateralidadeTextoSelecionado
            ]}>
                {opcao}
            </Text>
        </TouchableOpacity>
    ))}
</View>

    
                    <Text style={styles.label}>Convênios</Text>
                    <TouchableOpacity 
                        onPress={() => setMostrarModalConvenios(true)} 
                        style={styles.inputSelector}
                    >
                        <View style={styles.itemsContainer}>
                            {conveniosSelecionados.map(renderConvenioBox)}
                        </View>
                    </TouchableOpacity>
    
                    <ModalCheckBox
                        isVisible={mostrarModalConvenios}
                        onDismiss={() => setMostrarModalConvenios(false)}
                        onItemSelected={selecionarConvenio}
                        items={convenios.map(convenio => ({ id: convenio.id, label: convenio.nome }))}
                        selectedItems={conveniosSelecionados}
                        title="Selecione os Convênios"
                    />
    
                    <Text style={styles.label}>Plano</Text>
                    <TouchableOpacity 
                        onPress={() => setMostrarModalPlano(true)} 
                        style={styles.inputSelector}
                    >
                        <Text style={styles.inputText}>
                            {planoSelecionado ? planoSelecionado.nome : "Selecione um plano"}
                        </Text>
                    </TouchableOpacity>
    
                    <ModalModelo
                        isVisible={mostrarModalPlano}
                        onDismiss={() => setMostrarModalPlano(false)}
                        onItemSelected={selecionarPlano}
                        items={planos.map(plano => ({ id: plano.id, label: plano.nome }))}
                        title="Selecione o Plano"
                    />
    
                    <Text style={styles.label}>Matrícula</Text>
                    <TextInput
                        style={styles.inputSelector}
                        onChangeText={setMatricula}
                        value={matricula}
                        placeholder="Digite a matrícula"
                    />
    
                    <View style={styles.buttonContainer}>
                        <AppButton title="Etapa Anterior" onPress={irParaEtapaAnterior} />
                        <AppButton title="Cancelar" onPress={cancelarAgendamento} style={styles.cancelButton} />
                        <AppButton title="Próxima Etapa" onPress={salvarEtapa3} />
                    </View>
                </View>
            </ScrollView>
        );
    };
    
    const styles = StyleSheet.create({
        scrollView: {
            flex: 1,
        },
        container: {
            flex: 1,
            padding: 16,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#333',
            textAlign: 'center'
        },
        label: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 5,
            color: '#333'
        },
        inputSelector: {
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 10,
            marginBottom: 20,
            borderRadius: 10,
            backgroundColor: '#f5f5f5',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
            minHeight: 50, // Altura mínima inicial
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start', // Alinhamento no topo para múltiplas linhas
            paddingRight: 10,
            flexWrap: 'wrap', // Permite que os itens se envolvam em múltiplas linhas
        },
        inputText: {
            color: '#888888'
        },
        itemsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        itemBox: {
            flexDirection: 'row',
            backgroundColor: 'white',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            padding: 3,
            marginRight: 2,
            marginTop: 2,
        },
        itemBoxText: {
            fontSize: 14,
            marginRight: 5,
            color: 'black',
        },
        itemBoxRemove: {
            backgroundColor: 'red',
            height: 12,
            borderRadius: 5,
            padding: 2,
            alignItems: 'center',
        },
        itemBoxRemoveText: {
            color: 'white',
            fontSize: 10,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
        },
        lateralidadeContainer: {
            marginTop: 20,
        },
        lateralidadeOpcoes: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        lateralidadeOpcao: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            marginBottom: 10,
            width: '48%', // Aproximadamente metade da largura para duas colunas
        },
        lateralidadeOpcaoSelecionada: {
            backgroundColor: 'black',
        },
        lateralidadeTexto: {
            textAlign: 'center',
            color: 'black',
            alignItems: 'center'
        },
        lateralidadeTextoSelecionado: {
            color: 'white',
            fontWeight: 'bold',
            alignItems: 'center'
        },
        input: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
        },
        cancelButton: {
            backgroundColor: '#e57373', // Cor vermelha clara para o botão cancelar
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
        },
    });
    
    
    export default Etapa3Agendamento;
    
