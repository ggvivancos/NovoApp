import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import ModalModelo from '../../componentes/models/ModalModelo';
import * as GrupoDeAnestesiaService from '../../services/GrupoDeAnestesiaService';
import * as AnestesistaService from '../../services/AnestesistaService';
import { useAgendamento } from '../../context/AgendamentoContext';
import { DadosEtapa1 } from '../../types/types';

interface Etapa4Props {
    irParaProximaEtapa: () => void;
    irParaEtapaAnterior: () => void;
}

const Etapa4Agendamento: React.FC<Etapa4Props> = ({ irParaProximaEtapa, irParaEtapaAnterior }) => {
    const navigation = useNavigation();
    const [gruposDeAnestesia, setGruposDeAnestesia] = useState<any[]>([]);
    const [anestesistas, setAnestesistas] = useState<any[]>([]);
    const [grupoDeAnestesiaSelecionado, setGrupoDeAnestesiaSelecionado] = useState<any>(null);
    const [anestesistaSelecionado, setAnestesistaSelecionado] = useState<any>(null);
    const [mostrarModalGrupoDeAnestesia, setMostrarModalGrupoDeAnestesia] = useState(false);
    const [mostrarModalAnestesista, setMostrarModalAnestesista] = useState(false);
    const [aviso, setAviso] = useState('');
    const [leito, setLeito] = useState('');
    const [prontuario, setProntuario] = useState('');
    const [pacote, setPacote] = useState(false);
    const [tipoDeAcomodacao, setTipoDeAcomodacao] = useState('');
    const [mudancaDeAcomodacao, setMudancaDeAcomodacao] = useState(false);
    const [apa, setApa] = useState(false);
    const [utiPedida, setUtiPedida] = useState(false);
    const [utiConfirmada, setUtiConfirmada] = useState(false);
    const [hemoderivadosPedido, setHemoderivadosPedido] = useState(false);
    const [hemoderivadosConfirmado, setHemoderivadosConfirmado] = useState(false);
    const { limparDadosAgendamento } = useAgendamento();
    const [etapaPreparada, setEtapaPreparada] = useState(false);


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
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, salvarDadosEtapa4 } = useAgendamento();
    
    const salvarEtapa4 = () => {
        
        
        const dadosEtapa4 = {
            grupoDeAnestesiaSelecionado: grupoDeAnestesiaSelecionado?.id || null,
            anestesistaSelecionado: anestesistaSelecionado?.id || null,
            utiPedida,
            utiConfirmada,
            hemoderivadosPedido,
            hemoderivadosConfirmado,
            apa,
            leito,
            aviso,
            prontuario,
            pacote,
            tipoDeAcomodacao,
            mudancaDeAcomodacao,
        };
    
        console.log("Dados da Etapa 4:", dadosEtapa4);
    
        const dadosAgendamentoCompleto = {
            ...dadosEtapa1,
            ...dadosEtapa2,
            ...dadosEtapa3,
            ...dadosEtapa4
        };

        console.log("Dados do Agendamento Completo antes de salvar:", dadosAgendamentoCompleto);

    
        salvarDadosEtapa4(dadosAgendamentoCompleto); // Salve os dados
        irParaProximaEtapa(); // Navegue para a próxima etapa
    };
    

    interface SwitchSelectorProps {
        label: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
    }


    useEffect(() => {
        if (dadosEtapa4) {
            // Forçar atualização dos estados dos switches
            setUtiPedida(!dadosEtapa4.utiPedida);
            setUtiConfirmada(!dadosEtapa4.utiConfirmada);
            setHemoderivadosPedido(!dadosEtapa4.hemoderivadosPedido);
            setHemoderivadosConfirmado(!dadosEtapa4.hemoderivadosConfirmado);
            setApa(!dadosEtapa4.apa);
            setPacote(!dadosEtapa4.pacote);
    
            // Definir com os valores salvos
            setUtiPedida(dadosEtapa4.utiPedida);
            setUtiConfirmada(dadosEtapa4.utiConfirmada);
            setHemoderivadosPedido(dadosEtapa4.hemoderivadosPedido);
            setHemoderivadosConfirmado(dadosEtapa4.hemoderivadosConfirmado);
            setApa(dadosEtapa4.apa);
            setPacote(dadosEtapa4.pacote);
           
    
            // Atualiza os demais estados locais com os dados salvos
            const grupoSelecionado = gruposDeAnestesia.find(grupo => grupo.id === dadosEtapa4.grupoDeAnestesiaSelecionado);
            if (grupoSelecionado) {
                setGrupoDeAnestesiaSelecionado(grupoSelecionado);
            }
    
            const anestesistaEncontrado = anestesistas.find(anestesista => anestesista.id === dadosEtapa4.anestesistaSelecionado);
            if (anestesistaEncontrado) {
                setAnestesistaSelecionado(anestesistaEncontrado);
            }
    
            setAviso(dadosEtapa4.aviso);
            setLeito(dadosEtapa4.leito);
            setProntuario(dadosEtapa4.prontuario);
            setTipoDeAcomodacao(dadosEtapa4.tipoDeAcomodacao);
            setMudancaDeAcomodacao(dadosEtapa4.mudancaDeAcomodacao);
        }
    }, [dadosEtapa4, gruposDeAnestesia, anestesistas]);
    
    

const salvarEtapa4EPreparar = () => {
    // Salva os dados da Etapa 4 pela primeira vez
    salvarDadosEtapa4({
        grupoDeAnestesiaSelecionado: grupoDeAnestesiaSelecionado?.id || null,
        anestesistaSelecionado: anestesistaSelecionado?.id || null,
        utiPedida,
        utiConfirmada,
        hemoderivadosPedido,
        hemoderivadosConfirmado,
        apa,
        leito,
        aviso,
        prontuario,
        pacote,
        tipoDeAcomodacao,
        mudancaDeAcomodacao,
    });

    // Marca a etapa como preparada para avançar
    setEtapaPreparada(true);
};

    
    useEffect(() => {
        if (etapaPreparada) {
            // Espera um breve momento antes de proceder, para garantir que a tela tenha sido atualizada
            setTimeout(() => {
                // Salva os dados da Etapa 4 novamente, se necessário
                salvarDadosEtapa4({
                    grupoDeAnestesiaSelecionado: grupoDeAnestesiaSelecionado?.id || null,
                    anestesistaSelecionado: anestesistaSelecionado?.id || null,
                    utiPedida,
                    utiConfirmada,
                    hemoderivadosPedido,
                    hemoderivadosConfirmado,
                    apa,
                    leito,
                    aviso,
                    prontuario,
                    pacote,
                    tipoDeAcomodacao,
                    mudancaDeAcomodacao,
                });
    
                console.log("Dados da Etapa 4 salvos novamente, avançando para a próxima etapa.");
                irParaProximaEtapa();
    
                // Reseta o estado para evitar repetições
                setEtapaPreparada(false);
            }, 50); // Ajuste este tempo conforme necessário
        }
    }, [etapaPreparada, irParaProximaEtapa, salvarDadosEtapa4, grupoDeAnestesiaSelecionado, anestesistaSelecionado, utiPedida, utiConfirmada, hemoderivadosPedido, hemoderivadosConfirmado, apa, leito, aviso, prontuario, pacote]);
    

    useEffect(() => {
        GrupoDeAnestesiaService.obterGruposDeAnestesia().then(response => {
            setGruposDeAnestesia(response.data);
        }).catch(error => {
            console.error('Erro ao buscar grupos de anestesia:', error);
        });

        AnestesistaService.obterTodosAnestesistas().then(response => {
            setAnestesistas(response.data);
        }).catch(error => {
            console.error('Erro ao buscar anestesistas:', error);
        });
    }, []);

    const selecionarGrupoDeAnestesia = (id: number) => {
        const grupoSelecionado = gruposDeAnestesia.find(grupo => grupo.id === id);
        setGrupoDeAnestesiaSelecionado(grupoSelecionado);
        setMostrarModalGrupoDeAnestesia(false);
    };

    const selecionarAnestesista = (id: number) => {
        const anestesistaSelecionado = anestesistas.find(anestesista => anestesista.id === id);
        setAnestesistaSelecionado(anestesistaSelecionado);
        setMostrarModalAnestesista(false);
    };

    const SwitchSelector: React.FC<SwitchSelectorProps> = ({ label, value, onValueChange }) => {
        return (
            <View style={styles.switchContainer}>
                <Text style={styles.label}>{label}</Text>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                />
            </View>
        );
    };
    
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {/* Grupo de Anestesia */}
                <Text style={styles.label}>Grupo de Anestesia</Text>
                <TouchableOpacity onPress={() => setMostrarModalGrupoDeAnestesia(true)} style={styles.inputSelector}>
                    <Text style={styles.inputText}>
                        {grupoDeAnestesiaSelecionado ? grupoDeAnestesiaSelecionado.nome : "Selecione um grupo de anestesia"}
                    </Text>
                </TouchableOpacity>
                <ModalModelo
                    isVisible={mostrarModalGrupoDeAnestesia}
                    onDismiss={() => setMostrarModalGrupoDeAnestesia(false)}
                    onItemSelected={selecionarGrupoDeAnestesia}
                    items={gruposDeAnestesia.map(grupo => ({ id: grupo.id, label: grupo.nome || '' }))}
                    title="Selecione o Grupo de Anestesia"
                />
    
                {/* Anestesista */}
                <Text style={styles.label}>Anestesista</Text>
                <TouchableOpacity onPress={() => setMostrarModalAnestesista(true)} style={styles.inputSelector}>
                    <Text style={styles.inputText}>
                        {anestesistaSelecionado ? anestesistaSelecionado.nomecompleto : "Selecione um anestesista"}
                    </Text>
                </TouchableOpacity>
                <ModalModelo
                    isVisible={mostrarModalAnestesista}
                    onDismiss={() => setMostrarModalAnestesista(false)}
                    onItemSelected={selecionarAnestesista}
                    items={anestesistas.map(anestesista => ({ id: anestesista.id, label: anestesista.nomecompleto || '' }))}
                    title="Selecione o Anestesista"
                />
    
                {/* Aviso de Cirurgia, Leito */}
                <View style={styles.dualInputContainer}>
                    <View style={styles.inputHalf}>
                        <Text style={styles.label}>Aviso de Cirurgia</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAviso}
                            value={aviso}
                            placeholder="Digite o aviso"
                        />
                    </View>
                    <View style={styles.inputHalf}>
                        <Text style={styles.label}>Leito</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setLeito}
                            value={leito}
                            placeholder="Digite o número do leito"
                        />
                    </View>
                </View>
    
                {/* Prontuário */}
                <Text style={styles.label}>Prontuário</Text>
                <TextInput
                    style={[styles.input, styles.fullWidthInput]}
                    onChangeText={setProntuario}
                    value={prontuario}
                    placeholder="Digite o prontuário"
                />
    
                <View style={styles.acomodacaoCompletaContainer}>
                <View style={styles.switchAcomodacaoContainer}>
                    <SwitchSelector 
                        label="Mudança de Acomodação" 
                        value={mudancaDeAcomodacao} 
                        onValueChange={setMudancaDeAcomodacao}
                    />
                </View>
                <Text style={styles.label}>Tipo de Acomodação</Text>
                <View style={styles.tipoAcomodacaoOpcoesContainer}>
                    {['Enfermaria', 'Apartamento', 'Suíte'].map((tipo) => (
                        <TouchableOpacity
                            key={tipo}
                            style={[
                                styles.opcao,
                                tipoDeAcomodacao === tipo && styles.opcaoSelecionada
                            ]}
                            onPress={() => setTipoDeAcomodacao(tipo)}
                        >
                            <Text style={[
                                styles.opcaoTexto,
                                tipoDeAcomodacao === tipo && styles.opcaoTextoSelecionado
                            ]}>
                                {tipo}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>


    
                {/* Switches de configurações adicionais */}
                <SwitchSelector label="Pacote" value={pacote} onValueChange={setPacote} />
                <SwitchSelector label="APA" value={apa} onValueChange={setApa} />
                <SwitchSelector label="UTI (Pedido de Reserva)" value={utiPedida} onValueChange={setUtiPedida} />
                <SwitchSelector label="UTI (Pedido Confirmado)" value={utiConfirmada} onValueChange={setUtiConfirmada} />
                <SwitchSelector label="HEMODERIVADOS (Necessidade de Reserva)" value={hemoderivadosPedido} onValueChange={setHemoderivadosPedido} />
                <SwitchSelector label="HEMODERIVADOS (Reserva Confirmada)" value={hemoderivadosConfirmado} onValueChange={setHemoderivadosConfirmado} />
    
                {/* Botões de navegação */}
                <View style={styles.buttonContainer}>
                    <AppButton title="Etapa Anterior" onPress={irParaEtapaAnterior} />
                    <AppButton title="Cancelar" onPress={cancelarAgendamento} style={styles.cancelButton} />
                    <AppButton title="Próxima Etapa" onPress={salvarEtapa4EPreparar} />
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
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 10
        },
        inputText: {
            color: '#888888'
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
        },
        input: {
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
        },
        dualInputContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        inputHalf: {
            width: '48%', // Aproximadamente metade da largura para duas colunas
        },
        switchContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        cancelButton: {
            backgroundColor: '#e57373', // Um tom de vermelho claro
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20            ,
        },
        fullWidthInput: {
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#f5f5f5',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
            width: '100%',
            marginBottom: 20,
        },
        tipoAcomodacaoContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        opcoesContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
        },
        opcao: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            width: '30%',
        },
        opcaoSelecionada: {
            backgroundColor: 'black',
        },
        opcaoTexto: {
            textAlign: 'center',
            color: 'black',
        },
        opcaoTextoSelecionado: {
            color: 'white',
            fontWeight: 'bold',
        },
        acomodacaoCompletaContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        switchAcomodacaoContainer: {
            width: '100%', // Ocupa toda a largura
            marginBottom: 10, // Espaçamento entre os contêineres
        },
        tipoAcomodacaoOpcoesContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%', // Ocupa toda a largura
            marginTop: 10,
        },

      
    });
    



export default Etapa4Agendamento;
