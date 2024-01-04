import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import ModalPaciente from '../../componentes/models/ModalPaciente';
import * as PacienteService from '../../services/PacienteService';
import { Paciente } from '../../types/types';

const Etapa2Agendamento = () => {
    const navigation = useNavigation();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCreatingNewPaciente, setIsCreatingNewPaciente] = useState(false);

    // Campos do formulário de paciente
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [dataDeNascimento, setDataDeNascimento] = useState('');
    const [CPF, setCPF] = useState('');
    const [telefone, setTelefone] = useState('');
    const [observacao, setObservacao] = useState('');
    const [VAD, setVAD] = useState(false);
    const [alergia, setAlergia] = useState(false);
    const [alergiaLatex, setAlergiaLatex] = useState(false);

    useEffect(() => {
        PacienteService.obterTodosPacientes()
            .then(response => setPacientes(response.data))
            .catch(error => console.error('Erro ao buscar pacientes:', error));
    }, []);

    const formatarDataISO = (dataISO: string) => {
        const data = new Date(dataISO);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const handlePacienteSelecionado = (paciente: Paciente) => {
        setPacienteSelecionado(paciente);
        setIsCreatingNewPaciente(false);
        setNomeCompleto(paciente.nomecompleto);
        setDataDeNascimento(formatarDataISO(paciente.datadenascimento));
        setCPF(paciente.CPF);
        setTelefone(paciente.telefone);
        setObservacao(paciente.observacao);
        setVAD(paciente.VAD);
        setAlergia(paciente.alergia);
        setAlergiaLatex(paciente.alergiaLatex);
        setModalVisible(false);
    };

    const handleCriarPaciente = (nome: string) => {
        setIsCreatingNewPaciente(true);
        setNomeCompleto(nome);
        setDataDeNascimento('');
        setCPF('');
        setTelefone('');
        setObservacao('');
        setVAD(false);
        setAlergia(false);
        setAlergiaLatex(false);
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

    const salvarNovoPaciente = () => {
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

        PacienteService.criarPaciente(novoPaciente)
            .then(response => {
                if (response && response.id) {
                    Alert.alert('Sucesso', 'Paciente criado com sucesso!');
                    setIsCreatingNewPaciente(false);
                    setPacienteSelecionado(response);
                    setPacientes([...pacientes, response]);
                } else {
                    console.error('Resposta inesperada ao criar paciente:', response);
                    Alert.alert('Erro', 'Erro ao criar paciente. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro ao criar paciente:', error);
                Alert.alert('Erro', 'Erro ao criar paciente. Tente novamente.');
            });
    };

    const salvarAgendamento = () => {
        Alert.alert('Salvar Agendamento', 'Implementar lógica de salvar.');
    };

        // Continuação do componente Etapa2Agendamento

        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
    
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pacienteSelector}>
                        <Text style={styles.pacienteSelectorText}>
                            {pacienteSelecionado ? pacienteSelecionado.nomecompleto : "Selecione ou crie um paciente"}
                        </Text>
                    </TouchableOpacity>
    
                    <ModalPaciente
                        isVisible={isModalVisible}
                        onDismiss={() => setModalVisible(false)}
                        onPacienteSelected={handlePacienteSelecionado}
                        onPacienteCreated={handleCriarPaciente}
                        pacientes={pacientes}
                    />
    
                    {(pacienteSelecionado || isCreatingNewPaciente) && (
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
                                <Switch
                                    value={VAD}
                                    onValueChange={setVAD}
                                />
                            </View>
    
                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Alergia</Text>
                                <Switch
                                    value={alergia}
                                    onValueChange={setAlergia}
                                />
                            </View>
    
                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Alergia a Látex</Text>
                                <Switch
                                    value={alergiaLatex}
                                    onValueChange={setAlergiaLatex}
                                />
                            </View>
                        </>
                    )}
    
                    <View style={styles.buttonContainer}>
                        {isCreatingNewPaciente && (
                            <AppButton title="Salvar Paciente" onPress={salvarNovoPaciente} />
                        )}
                        <AppButton title="Salvar" onPress={salvarAgendamento} />
                        <AppButton title="Cancelar" onPress={() => navigation.goBack()} />
                    </View>
                </View>
            </ScrollView>
        );
    };
    
    const styles = StyleSheet.create({
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
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
        },
        scrollView: {
            flex: 1,
        },
        switchContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
    });
    
    export default Etapa2Agendamento;
    
