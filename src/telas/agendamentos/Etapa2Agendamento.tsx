import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import ModalPaciente from '../../componentes/models/ModalPaciente';
import * as PacienteService from '../../services/PacienteService';
import * as PacienteProvisorioService from '../../services/PacienteProvisorioService';
import { useAgendamento } from '../../context/AgendamentoContext';
import { PacienteData, PacienteProvisorioData } from '../../types';
import  { DadosEtapa2, DadosEtapa1 } from '../../types/types';





interface Etapa2Props {
    irParaProximaEtapa: () => void;
    irParaEtapaAnterior: () => void;
  }

const Etapa2Agendamento: React.FC<Etapa2Props> = ({ irParaProximaEtapa, irParaEtapaAnterior }) => {
    console.log("Iniciando componente Etapa2Agendamento");

    const navigation = useNavigation();
    const [pacientes, setPacientes] = useState<PacienteData[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState<PacienteData | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCreatingNewPaciente, setIsCreatingNewPaciente] = useState(false);
    const [isCreatingPacienteProvisorio, setIsCreatingPacienteProvisorio] = useState(false);
    const { dadosEtapa1, dadosEtapa2, salvarDadosEtapa2 } = useAgendamento();
    const [statusPaciente, setStatusPaciente] = useState(''); // Estado para armazenar o status do paciente
    const [isCarregandoDadosIniciais, setIsCarregandoDadosIniciais] = useState(true);
    const [pacienteProvisorioId, setPacienteProvisorioId] = useState<number | undefined>(undefined);

    const [estaAvancando, setEstaAvancando] = useState(false);

    // Campos do formulário de paciente
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [dataDeNascimento, setDataDeNascimento] = useState('');
    const [CPF, setCPF] = useState('');
    const [telefone, setTelefone] = useState('');
    const [observacao, setObservacao] = useState('');
    const [VAD, setVAD] = useState(false);
    const [alergia, setAlergia] = useState(false);
    const [alergiaLatex, setAlergiaLatex] = useState(false);

    // Funções auxiliares
    const limparFormulario = () => {
        setDataDeNascimento('');
        setCPF('');
        setTelefone('');
        setObservacao('');
        setVAD(false);
        setAlergia(false);
        setAlergiaLatex(false);
    };


    

    
    const carregarDadosIniciais = async () => {
        setIsCarregandoDadosIniciais(true);

        if (dadosEtapa2) {
            if (dadosEtapa2.statusPaciente) {
                setStatusPaciente(dadosEtapa2.statusPaciente);
                console.log("Status do Paciente carregado:", dadosEtapa2.statusPaciente); // Log para verificar o status do paciente

            }
    
            if (dadosEtapa2.statusPaciente === 'Definitivo' && dadosEtapa2.pacienteId) {
                try {
                    const paciente = await PacienteService.obterPacientePorId(dadosEtapa2.pacienteId.toString());
                    console.log("Paciente carregado:", paciente);
    
                    if (paciente) {
                        setPacienteSelecionado(paciente);
                        setIsCreatingNewPaciente(false);
                        setIsCreatingPacienteProvisorio(false);
                        setNomeCompleto(paciente.nomecompleto);
                        setDataDeNascimento(formatarDataISO(paciente.datadenascimento));
                        setCPF(paciente.CPF);
                        setTelefone(paciente.telefone);
                        setObservacao(paciente.observacao);
                        setVAD(paciente.VAD);
                        setAlergia(paciente.alergia);
                        setAlergiaLatex(paciente.alergiaLatex);
                    }
                } catch (error) {
                    console.error('Erro ao carregar detalhes do paciente:', error);
                    Alert.alert('Erro', 'Não foi possível carregar os detalhes do paciente.');
                }
            } else if (dadosEtapa2.statusPaciente === 'Provisório' && dadosEtapa2.pacienteProvisorioId) {
                try {
                    const pacienteProvisorio = await PacienteProvisorioService.obterPacienteProvisorioPorId(dadosEtapa2.pacienteProvisorioId.toString());
                    console.log("Paciente Provisório carregado:", pacienteProvisorio);
    
                    if (pacienteProvisorio) {
                        setPacienteSelecionado(pacienteProvisorio);
                        setIsCreatingNewPaciente(false);
                        setIsCreatingPacienteProvisorio(true);
                        setNomeCompleto(pacienteProvisorio.nomecompleto);
                        setDataDeNascimento(formatarDataISO(pacienteProvisorio.datadenascimento));
                        setCPF(pacienteProvisorio.CPF);
                        setTelefone(pacienteProvisorio.telefone);
                        setObservacao(pacienteProvisorio.observacao);
                        setVAD(pacienteProvisorio.VAD);
                        setAlergia(pacienteProvisorio.alergia);
                        setAlergiaLatex(pacienteProvisorio.alergiaLatex);
                    }

                    setIsCarregandoDadosIniciais(false); // Adiciona esta linha no final da função

                } catch (error) {
                    console.error('Erro ao carregar detalhes do paciente provisório:', error);
                    Alert.alert('Erro', 'Não foi possível carregar os detalhes do paciente provisório.');
                }
            }
        }
    };
    
    
    useEffect(() => {
        carregarDadosIniciais();
    }, [dadosEtapa2, pacienteProvisorioId]);
    

    useEffect(() => {
        if (!isCarregandoDadosIniciais) {
            if (pacienteSelecionado || isCreatingNewPaciente) {
                setStatusPaciente('Definitivo');
            } else if (isCreatingPacienteProvisorio) {
                setStatusPaciente('Provisório');
            }
            console.log("Status do Paciente atualizado (Useeefect):", statusPaciente);
        }
    }, [pacienteSelecionado, isCreatingNewPaciente, isCreatingPacienteProvisorio, isCarregandoDadosIniciais]);
    
    
    
    
    
    
    
    
    
    
    
    
    //testes re renderizações

    useEffect(() => {
        console.log("pacienteSelecionado mudou:", pacienteSelecionado);
    }, [pacienteSelecionado]);
    
    useEffect(() => {
        console.log("isCreatingNewPaciente mudou:", isCreatingNewPaciente);
    }, [isCreatingNewPaciente]);
    
    useEffect(() => {
        console.log("isCreatingPacienteProvisorio mudou:", isCreatingPacienteProvisorio);
    }, [isCreatingPacienteProvisorio]);
    
    useEffect(() => {
        console.log("pacienteProvisorioId mudou:", pacienteProvisorioId);
    }, [pacienteProvisorioId]);
    
    useEffect(() => {
        console.log("nomeCompleto mudou:", nomeCompleto);
    }, [nomeCompleto]);
    
    useEffect(() => {
        console.log("dataDeNascimento mudou:", dataDeNascimento);
    }, [dataDeNascimento]);
    
    useEffect(() => {
        console.log("CPF mudou:", CPF);
    }, [CPF]);
    
    useEffect(() => {
        console.log("telefone mudou:", telefone);
    }, [telefone]);
    
    useEffect(() => {
        console.log("observacao mudou:", observacao);
    }, [observacao]);
    
    useEffect(() => {
        console.log("VAD mudou:", VAD);
    }, [VAD]);
    
    useEffect(() => {
        console.log("alergia mudou:", alergia);
    }, [alergia]);
    
    useEffect(() => {
        console.log("alergiaLatex mudou:", alergiaLatex);
    }, [alergiaLatex]);
    
    useEffect(() => {
        console.log("pacienteSelecionado mudou:", pacienteSelecionado);
    }, [pacienteSelecionado]);
    
    useEffect(() => {
        console.log("isCreatingNewPaciente mudou:", isCreatingNewPaciente);
    }, [isCreatingNewPaciente]);
    
    useEffect(() => {
        console.log("isCreatingPacienteProvisorio mudou:", isCreatingPacienteProvisorio);
    }, [isCreatingPacienteProvisorio]);
    
    useEffect(() => {
        console.log("pacienteProvisorioId mudou:", pacienteProvisorioId);
    }, [pacienteProvisorioId]);
    















    //let dadosEtapa2: DadosEtapa2 = { statusPaciente: undefined };



    const salvarEtapa2 = async () => {
        console.log("Iniciando salvarEtapa2");
        console.log("Paciente Selecionado:", pacienteSelecionado);
        console.log("isCreatingNewPaciente:", isCreatingNewPaciente);
        console.log("isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
        console.log("isCarregandoDadosIniciais:", isCarregandoDadosIniciais);
        if (!pacienteSelecionado && !isCreatingNewPaciente && !isCreatingPacienteProvisorio) {
            Alert.alert('Erro', 'Por favor, selecione ou crie um paciente antes de prosseguir.');
            return;
        }
    
        console.log("isCreatingNewPaciente:", isCreatingNewPaciente);
        console.log("isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
        console.log("isCarregandoDadosIniciais:", isCarregandoDadosIniciais);
    
        let dadosEtapa2: DadosEtapa2 = { statusPaciente: undefined };
    
        console.log("Paciente Provisório ID antes de salvar:", pacienteProvisorioId); // Adicione este log

        
        if (isCreatingPacienteProvisorio) {
            console.log("Entrou na condição isCreatingPacienteProvisorio");
            console.log("PacienteSelecionado ID:", pacienteSelecionado ? pacienteSelecionado.id : 'null');
            console.log("dadosEtapa2.pacienteProvisorioId:", dadosEtapa2.pacienteProvisorioId);
            if (pacienteSelecionado && pacienteSelecionado.id === pacienteProvisorioId) {
                console.log("Entrou na condição de atualizar paciente provisório");
  
                console.log("222isCreatingNewPaciente:", isCreatingNewPaciente);
                console.log("222isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
                console.log("222isCarregandoDadosIniciais:", isCarregandoDadosIniciais);

                const dadosAtualizados = {
                    id: dadosEtapa2.pacienteProvisorioId, // ID do paciente
                    nomecompleto: nomeCompleto,
                    datadenascimento: dataDeNascimento,
                    CPF: CPF,
                    telefone: telefone,
                    observacao: observacao,
                    VAD: VAD,
                    alergia: alergia,
                    alergiaLatex: alergiaLatex
                    // Adicione outros campos conforme necessário
                };
                if (typeof pacienteProvisorioId === 'number') {
                    const dadosAtualizados = {
                        id: pacienteProvisorioId,
                    };
    
                    dadosEtapa2 = {
                        pacienteProvisorioId: dadosEtapa2.pacienteProvisorioId,
                        statusPaciente: 'Provisório'
                    };
                    console.log("Atualizando paciente provisório com ID:", dadosEtapa2.pacienteProvisorioId);
                }
            } else {
                console.log("Entrou na condição de criar novo paciente provisório");
                const novoPacienteProvisorioId = await salvarPacienteProvisorio();
                console.log("444isCreatingNewPaciente:", isCreatingNewPaciente);
                console.log("444isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
                console.log("4444isCarregandoDadosIniciais:", isCarregandoDadosIniciais);
                if (!novoPacienteProvisorioId) return;
    
                dadosEtapa2 = {
                    pacienteProvisorioId: novoPacienteProvisorioId,
                    statusPaciente: 'Provisório'
                };
                console.log("Salvando novo paciente provisório com ID:", novoPacienteProvisorioId);
            }
        } else if (pacienteSelecionado) {
            console.log("Entrou na condição de salvar paciente definitivo");
            dadosEtapa2 = {
                pacienteId: pacienteSelecionado.id,
                statusPaciente: 'Definitivo'
            };
            console.log("Salvando paciente definitivo com ID:", pacienteSelecionado.id);
        }
    
        if (dadosEtapa2.statusPaciente) {
            console.log("Dados da Etapa 2 antes de salvar no contexto:", dadosEtapa2);
            salvarDadosEtapa2(dadosEtapa2);
            console.log("Dados da Etapa 2 após chamar a função salvarDadosEtapa2", dadosEtapa2);
            setEstaAvancando(true);
        }
    };
    
    
        
    
    

    
    
    useEffect(() => {
        if (!isCarregandoDadosIniciais) {
            if (pacienteSelecionado && !isCreatingPacienteProvisorio) {
                setStatusPaciente('Definitivo');
            } else if (isCreatingPacienteProvisorio) {
                setStatusPaciente('Provisório');
            }
            console.log("Status do Paciente atualizado (useEffect):", statusPaciente);
        }
    }, [pacienteSelecionado, isCreatingPacienteProvisorio, isCarregandoDadosIniciais]);
    
    
    
    

    useEffect(() => {
        if (dadosEtapa2 && estaAvancando) {
            irParaProximaEtapa();
        }
    }, [dadosEtapa2, estaAvancando, irParaProximaEtapa]);
    

    const formatarDataISO = (dataISO: string) => {
        const data = new Date(dataISO);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const handleDataDeNascimentoChange = (text: string) => {
        let formattedText = text.replace(/[^0-9]/g, '');
        if (formattedText.length > 2 && formattedText.length <= 4) {
            formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2);
        }
        if (formattedText.length > 4) {
            formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2, 4) + '/' + formattedText.slice(4, 8);
        }
        setDataDeNascimento(formattedText);
    };

    // Funções de manipulação de pacientes
    const handlePacienteSelecionado = (paciente: PacienteData) => {
        setPacienteSelecionado(paciente);
        setIsCreatingNewPaciente(false);
        setIsCreatingPacienteProvisorio(false);
        setNomeCompleto(paciente.nomecompleto);
        setDataDeNascimento(formatarDataISO(paciente.datadenascimento));
        setCPF(paciente.CPF);
        setTelefone(paciente.telefone);
        setObservacao(paciente.observacao);
        setVAD(paciente.VAD);
        setAlergia(paciente.alergia);
        setAlergiaLatex(paciente.alergiaLatex);
        setModalVisible(false);
        salvarDadosEtapa2({ pacienteId: paciente.id, statusPaciente: 'Definitivo' });

    };

    const handleCriarPaciente = (nome: string) => {
        console.log("Criando novo paciente");

        setIsCreatingNewPaciente(true);
        setIsCreatingPacienteProvisorio(false);
        setNomeCompleto(nome);
        console.log("Nome completo atualizado para:", nomeCompleto);

        limparFormulario();
    };

    const handleCriarPacienteProvisorio = (nome: string) => {
        console.log("Criando paciente provisório");
        setIsCreatingPacienteProvisorio(true);
        setIsCreatingNewPaciente(false);
        setNomeCompleto(nome); // Definindo o nome do paciente
        console.log("Nome completo atualizado para:", nomeCompleto);

        limparFormulario();
    };


    const salvarNovoPaciente = async () => {
        console.log("Salvando novo paciente", { nomeCompleto, dataDeNascimento, CPF, telefone, observacao, VAD, alergia, alergiaLatex });
    
        let dataFormatadaISO = '';
        const partesData = dataDeNascimento.split('/');
        if (partesData.length === 3 && partesData[2].length === 4) {
            dataFormatadaISO = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`).toISOString();
        } else {
            Alert.alert('Erro', 'Data de nascimento inválida.');
            return;
        }
    
        const novoPaciente = {
            nomecompleto: nomeCompleto,
            datadenascimento: dataFormatadaISO,
            CPF,
            telefone,
            observacao,
            VAD,
            alergia,
            alergiaLatex
        };
    
        try {
            const response = await PacienteService.criarPaciente(novoPaciente);
            if (response && response.id) {
                Alert.alert('Sucesso', 'Paciente criado com sucesso!');
                setIsCreatingNewPaciente(false);
                setPacienteSelecionado(response);
                setPacientes(pacientesAnteriores => [...pacientesAnteriores, response]);
                salvarDadosEtapa2({ ...dadosEtapa2, pacienteId: response.id, statusPaciente: 'Definitivo' });
                return response.id; // Retorna o ID do novo paciente
                

            } else {
                Alert.alert('Erro', 'Erro ao criar paciente. Tente novamente.');
                return null; // Retorna null em caso de falha

            }
        } catch (error) {
            console.error("Erro ao criar paciente", error);
            Alert.alert('Erro', 'Erro ao criar paciente. Tente novamente.');
            return null; // Retorna null em caso de erro

        }
    };
    

    const salvarPacienteProvisorio = async () => {
        console.log("Salvando paciente provisório", { nomeCompleto, dataDeNascimento, CPF, telefone, observacao, VAD, alergia, alergiaLatex });
    
        let dataFormatadaISO = '';
        const partesData = dataDeNascimento.split('/');
        if (partesData.length === 3 && partesData[2].length === 4) {
            dataFormatadaISO = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`).toISOString();
        } else {
            Alert.alert('Erro', 'Data de nascimento inválida.');
            return null;
        }
    
        const novoPacienteProvisorio = {
            nomecompleto: nomeCompleto,
            datadenascimento: dataFormatadaISO,
            CPF,
            telefone,
            observacao,
            VAD,
            alergia,
            alergiaLatex
        };
    
        try {
            const response = await PacienteProvisorioService.criarPacienteProvisorio(novoPacienteProvisorio);
            if (response && response.id) {
                Alert.alert('Sucesso', 'Paciente provisório criado com sucesso!');
                setPacienteProvisorioId(response.id);
                console.log("Paciente Provisório ID definido:", response.id); // Adicione este log
                setIsCreatingPacienteProvisorio(false);
                setPacienteSelecionado(response);
                setPacientes(pacientesAnteriores => [...pacientesAnteriores, response]);
                salvarDadosEtapa2({ ...dadosEtapa2, pacienteProvisorioId: response.id, statusPaciente: 'Provisório' });
                return response.id; // Retorna o ID do paciente provisório
            } else {
                Alert.alert('Erro', 'Erro ao criar paciente provisório. Tente novamente.');
                return null; // Retorna null em caso de falha
            }
        } catch (error) {
            console.error("Erro ao criar paciente provisório", error);
            Alert.alert('Erro', 'Erro ao criar paciente provisório. Tente novamente.');
            return null; // Retorna null em caso de erro
        }
    };

    const atualizarPacienteProvisorio = async (id: number, dadosAtualizados: PacienteProvisorioData) => {
        console.log("Atualizando paciente provisório", dadosAtualizados);
    
        try {
            const response = await PacienteProvisorioService.atualizarPacienteProvisorio(id, dadosAtualizados);
            if (response && response.id) {
                Alert.alert('Sucesso', 'Paciente provisório atualizado com sucesso!');
                setIsCreatingPacienteProvisorio(false);
                setPacienteSelecionado(response);
                setPacientes(pacientesAnteriores => 
                    pacientesAnteriores.map(p => p.id === response.id ? response : p)
                );
                salvarDadosEtapa2({ ...dadosEtapa2, pacienteProvisorioId: response.id, statusPaciente: 'Provisório' });
                return response.id;
            } else {
                Alert.alert('Erro', 'Erro ao atualizar paciente provisório. Tente novamente.');
                return null;
            }
        } catch (error) {
            console.error("Erro ao atualizar paciente provisório", error);
            Alert.alert('Erro', 'Erro ao atualizar paciente provisório. Tente novamente.');
            return null;
        }
    };

    const atualizarPaciente = async (id: number, dadosAtualizados: PacienteData) => {
        console.log("Atualizando paciente", dadosAtualizados);
    
        try {
            const response = await PacienteService.atualizarPaciente(id, dadosAtualizados);
            if (response && response.id) {
                Alert.alert('Sucesso', 'Paciente atualizado com sucesso!');
                setPacienteSelecionado(response);
                setPacientes(pacientesAnteriores => 
                    pacientesAnteriores.map(p => p.id === response.id ? response : p)
                );
                salvarDadosEtapa2({ ...dadosEtapa2, pacienteId: response.id, statusPaciente: 'Definitivo' });
                return response.id;
            } else {
                Alert.alert('Erro', 'Erro ao atualizar paciente. Tente novamente.');
                return null;
            }
        } catch (error) {
            console.error("Erro ao atualizar paciente", error);
            Alert.alert('Erro', 'Erro ao atualizar paciente. Tente novamente.');
            return null;
        }
    };
    
    
    
    

    // Outras funções
    const cancelarAgendamento = () => {
        Alert.alert(
            "Cancelar Agendamento",
            "Tem certeza de que deseja cancelar o agendamento?",
            [
                { text: "Não", style: "cancel" },
                { text: "Sim", onPress: () => navigation.goBack() }
            ]
        );
    };

    useEffect(() => {
        PacienteService.obterTodosPacientes()
            .then(response => setPacientes(response.data))
            .catch(error => console.error('Erro ao buscar pacientes:', error));
    }, []);

    // Renderização do componente
    return (
        <>
            {console.log("Renderizando componente, Paciente Provisório ID:", pacienteProvisorioId)}
            <ScrollView style={styles.scrollView}>

            <View style={styles.container}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pacienteSelector}>
                <Text style={styles.pacienteSelectorText}>
                    {pacienteSelecionado ? pacienteSelecionado.nomecompleto :
                    (isCreatingNewPaciente || isCreatingPacienteProvisorio) && nomeCompleto !== '' ? nomeCompleto : 
                    "Selecione ou crie um paciente"}
                </Text>
                </TouchableOpacity>

                <ModalPaciente
                    isVisible={isModalVisible}
                    onDismiss={() => setModalVisible(false)}
                    onPacienteSelected={handlePacienteSelecionado}
                    onPacienteCreated={handleCriarPaciente}
                    onPacienteProvisorioCreated={handleCriarPacienteProvisorio}
                    pacientes={pacientes}
                />
                 {/* Exibição do Status do Paciente como Chave Seletora */}
                 <View style={styles.statusSelector}>
                    <View style={[styles.statusOption, statusPaciente === 'Definitivo' ? styles.statusSelected : styles.statusNotSelected]}>
                        <Text style={[styles.statusOptionText, statusPaciente === 'Definitivo' ? styles.statusSelectedText : null]}>
                            Paciente Definitivo
                        </Text>
                    </View>
                    <View style={[styles.statusOption, statusPaciente === 'Provisório' ? styles.statusSelected : styles.statusNotSelected]}>
                        <Text style={[styles.statusOptionText, statusPaciente === 'Provisório' ? styles.statusSelectedText : null]}>
                            Paciente Provisório
                        </Text>
                    </View>
                </View>

                {(pacienteSelecionado || isCreatingNewPaciente || isCreatingPacienteProvisorio) && (
                    <>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            value={nomeCompleto}
                            onChangeText={setNomeCompleto}
                            placeholder="Nome completo do paciente"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Data de Nascimento</Text>
                        <TextInput
                            value={dataDeNascimento}
                            onChangeText={handleDataDeNascimentoChange}
                            placeholder="Data de nascimento"
                            style={styles.input}
                        />

                        <Text style={styles.label}>CPF</Text>
                        <TextInput
                            value={CPF}
                            onChangeText={setCPF}
                            placeholder="CPF"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Telefone</Text>
                        <TextInput
                            value={telefone}
                            onChangeText={setTelefone}
                            placeholder="Telefone"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Observação</Text>
                        <TextInput
                            value={observacao}
                            onChangeText={setObservacao}
                            placeholder="Observação"
                            style={styles.input}
                        />

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>VAD</Text>
                            <Switch value={VAD} onValueChange={setVAD} />
                        </View>

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Alergia</Text>
                            <Switch value={alergia} onValueChange={setAlergia} />
                        </View>

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Alergia a Látex</Text>
                            <Switch value={alergiaLatex} onValueChange={setAlergiaLatex} />
                        </View>
                    </>
                )}

                <View style={styles.buttonContainer}>
                    <AppButton title="Etapa Anterior" onPress={irParaEtapaAnterior} />
                    <AppButton title="Cancelar" onPress={cancelarAgendamento} style={styles.cancelButton} />
                    <AppButton title="Próxima Etapa" onPress={salvarEtapa2} />
                </View>
            </View>
        </ScrollView>
     </>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    pacienteSelector: {
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
    pacienteSelectorText: {
        color: '#888888'
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333'
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
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#e57373',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    statusOption: {
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    statusOptionText: {
        textAlign: 'center',
    },
    statusSelected: {
        backgroundColor: '#000', // Fundo preto quando selecionado
    },
    statusNotSelected: {
        backgroundColor: '#fff', // Fundo branco quando não selecionado
    },
    statusSelectedText: {
        color: '#fff', // Texto branco quando selecionado
        fontWeight: 'bold',
    },
});

export default Etapa2Agendamento;