import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as PacienteService from '../../services/PacienteService';

type RouteParams = {
    pacienteId?: string;
}

const NovoPaciente = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const pacienteId = params?.pacienteId;

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [dataDeNascimento, setDataDeNascimento] = useState('');
    const [CPF, setCPF] = useState('');
    const [telefone, setTelefone] = useState('');
    const [observacao, setObservacao] = useState('');
    const [VAD, setVAD] = useState(false);
    const [alergia, setAlergia] = useState(false);
    const [alergiaLatex, setAlergiaLatex] = useState(false);

    const formatarData = (data: string) => {
        const partesData = data.split('T')[0].split('-'); // Separa a data e remove a hora
        return `${partesData[2]}/${partesData[1]}/${partesData[0]}`; // Formata para DD/MM/AAAA
    };
    


    const handleDataDeNascimentoChange = (text: string) => {
        let formattedText = text.split('/').join('');
        if (formattedText.length > 2) {
            formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2);
        }
        if (formattedText.length > 5) {
            formattedText = formattedText.slice(0, 5) + '/' + formattedText.slice(5, 9);
        }
        setDataDeNascimento(formattedText);
    };

    useEffect(() => {
        if (pacienteId) {
            PacienteService.obterPacientePorId(pacienteId)
                .then((paciente: any) => {
                    setNomeCompleto(paciente.nomecompleto);
                    setDataDeNascimento(formatarData(paciente.datadenascimento));
                    setCPF(paciente.CPF);
                    setTelefone(paciente.telefone);
                    setObservacao(paciente.observacao);
                    setVAD(paciente.VAD);
                    setAlergia(paciente.alergia);
                    setAlergiaLatex(paciente.alergiaLatex);
                }) 
                .catch(err => console.error("Erro ao buscar paciente:", err));
        }
    }, [pacienteId]);

    const salvar = () => {
        if (!nomeCompleto || !dataDeNascimento) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Converter a data de nascimento para o formato esperado pelo backend
        const partesData = dataDeNascimento.split('/');
        const dataFormatadaISO = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`).toISOString();
    
        const pacienteData = {
            nomecompleto: nomeCompleto,
            datadenascimento: dataFormatadaISO, // Data no formato ISO 8601
            CPF,
            telefone,
            observacao,
            VAD,
            alergia,
            alergiaLatex: alergiaLatex || false // Garantir que não seja undefined
        };

        console.log("Dados do paciente:", pacienteData);

        if (pacienteId) {
            PacienteService.atualizarPaciente(Number(pacienteId), pacienteData)
                .then(response => {
                    Alert.alert('Sucesso', 'Paciente atualizado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar paciente:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            PacienteService.criarPaciente(pacienteData)
                .then(response => {
                    Alert.alert('Sucesso', 'Paciente criado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar paciente:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {pacienteId ? 'Editar Paciente' : 'Novo Paciente'}
                    </Text>

                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput
                        value={nomeCompleto}
                        onChangeText={setNomeCompleto}
                        placeholder="Digite o nome completo do paciente"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Data de Nascimento</Text>
                    <TextInput
    value={dataDeNascimento}
    onChangeText={handleDataDeNascimentoChange}
    placeholder="DD/MM/AAAA"
    style={styles.input}
    keyboardType="numeric"
/>

                    <Text style={styles.label}>CPF</Text>
                    <TextInput
                        value={CPF}
                        onChangeText={setCPF}
                        placeholder="Digite o CPF"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Digite o telefone"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Observação</Text>
                    <TextInput
                        value={observacao}
                        onChangeText={setObservacao}
                        placeholder="Digite alguma observação"
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

                    <View style={styles.buttonContainer}>
                        <AppButton title="Salvar" onPress={salvar} />
                        <AppButton title="Cancelar" onPress={() => navigation.goBack()} />
                    </View>
                </View>
            </ScrollView>
        </GlobalLayout>
    );
};

const styles = StyleSheet.create({
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    scrollView: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default NovoPaciente;
