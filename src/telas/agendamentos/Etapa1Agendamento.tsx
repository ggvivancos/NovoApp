
import React, { useState, useEffect } from 'react';
import { DadosEtapa1, useAgendamento } from '../../context/AgendamentoContext';
import { View, StyleSheet, TextInput, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ModalCheckBox from '../../componentes/models/ModalCheckBox';
import * as CirurgiaoService from '../../services/CirurgiaoService';
import * as StatusService from '../../services/StatusService';
import * as HospitalService from '../../services/HospitalService';
import * as SetorService from '../../services/SetorService';
import * as SalaDeCirurgiaService from '../../services/SalaDeCirurgiaService';

import ModalModelo from '../../componentes/models/ModalModelo';
 // Importe o serviço de status


 interface Etapa1Props {
    irParaProximaEtapa: () => void;
    dadosIniciais: any; // Use um tipo mais específico se possível
}

 interface Setor {
    id: number;
    nome: string;
}

interface SalaDeCirurgia {
    id: number;
    nome: string;
}

interface Etapa1Props {
    irParaProximaEtapa: () => void;
}


LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [
        'Jan.', 'Fev.', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'
    ],
    dayNames: [
        'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
};
LocaleConfig.defaultLocale = 'pt-br';

const Etapa1Agendamento: React.FC<Etapa1Props> = ({ irParaProximaEtapa }) => {
    const navigation = useNavigation();
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [horarioInicio, setHorarioInicio] = useState('');
    const [duracao, setDuracao] = useState('');
    const [cirurgioes, setCirurgioes] = useState<any[]>([]);
    const [cirurgioesSelecionados, setCirurgioesSelecionados] = useState<any[]>([]);
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [mostrarModalCirurgioes, setMostrarModalCirurgioes] = useState(false);
    const [status, setStatus] = useState<any[]>([]); // Armazena os status disponíveis
    const [statusSelecionado, setStatusSelecionado] = useState({ id: 1, nome: 'Agendado' }); // Valor padrão
    const [mostrarModalStatus, setMostrarModalStatus] = useState(false);
    const [hospitais, setHospitais] = useState<any[]>([]);
    const [setores, setSetores] = useState<any[]>([]);
    const [salasDeCirurgia, setSalasDeCirurgia] = useState<any[]>([]);
    const [hospitalSelecionado, setHospitalSelecionado] = useState({ id: 1, nome: 'São Lucas' });
    const [setorSelecionado, setSetorSelecionado] = useState<any>(null);
    const [salaDeCirurgiaSelecionada, setSalaDeCirurgiaSelecionada] = useState<any>(null);
    const [mostrarModalHospital, setMostrarModalHospital] = useState(false);
    const [mostrarModalSetor, setMostrarModalSetor] = useState(false);
    const [mostrarModalSalaDeCirurgia, setMostrarModalSalaDeCirurgia] = useState(false);
    const [setoresFiltrados, setSetoresFiltrados] = useState<Setor[]>([]);
    const [salasDeCirurgiaFiltradas, setSalasDeCirurgiaFiltradas] = useState<SalaDeCirurgia[]>([]);


    const { dadosEtapa1, salvarDadosEtapa1 } = useAgendamento();
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
        if (dadosEtapa1) {
            setDataSelecionada(dadosEtapa1.dataSelecionada);
            setHorarioInicio(dadosEtapa1.horarioInicio);
            setDuracao(dadosEtapa1.duracao);
            setCirurgioesSelecionados(dadosEtapa1.cirurgioesSelecionados);
            // Defina o status selecionado com base no ID armazenado em dadosEtapa1.statusId
            const statusEncontrado = status.find(s => s.id === dadosEtapa1.statusId);
            if (statusEncontrado) {
                setStatusSelecionado(statusEncontrado);
            }
        }
    }, [dadosEtapa1]);
    
    

    useEffect(() => {
        CirurgiaoService.obterCirurgioes().then(response => {
            setCirurgioes(response.data);
        }).catch(error => {
            console.error('Erro ao buscar cirurgiões:', error);
        });
    }, []);

    useEffect(() => {
        StatusService.obterTodosStatus()
            .then(response => {
                setStatus(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar status:', error);
            });
    }, []);

    

    const selecionarStatus = (id:number) => {
        const statusEscolhido = status.find(s => s.id === id);
        setStatusSelecionado(statusEscolhido);
        setMostrarModalStatus(false);

    };
    

    const onDayPress = (day: { dateString: string }) => {
        const [year, month, dayOfMonth] = day.dateString.split('-');
        const formattedDate = `${dayOfMonth}/${month}/${year}`;
        setDataSelecionada(formattedDate);
        setMostrarCalendario(false);
    };

    const formatarHorario = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        let formatted = value.replace(/[^0-9]/g, '');
        if (formatted.length > 2) {
            formatted = formatted.slice(0, 2) + ':' + formatted.slice(2);
        }
        if (formatted.length > 5) {
            formatted = formatted.slice(0, 5);
        }
        setter(formatted);
    };

    const selecionarCirurgiao = (id: number) => {
        const jaSelecionado = cirurgioesSelecionados.includes(id);
        if (jaSelecionado) {
            setCirurgioesSelecionados(cirurgioesSelecionados.filter(item => item !== id));
        } else {
            setCirurgioesSelecionados([...cirurgioesSelecionados, id]);
        }
    };

    const removerCirurgiao = (id: number) => {
        setCirurgioesSelecionados(cirurgioesSelecionados.filter(item => item !== id));
    };

    const renderCirurgiaoBox = (id: number) => {
        const cirurgiao = cirurgioes.find(c => c.id === id);
        return (
            <View key={id} style={styles.cirurgiaoBox}>
                <Text style={styles.cirurgiaoBoxText}>{cirurgiao?.nome}</Text>
                <TouchableOpacity onPress={() => removerCirurgiao(id)} style={styles.cirurgiaoBoxRemove}>
                    <Text style={styles.cirurgiaoBoxRemoveText}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Função para salvar os dados da etapa 1 e navegar para a próxima etapa
    const salvarEtapa1 = () => {
        const dadosEtapa1 = {
            dataSelecionada,
            horarioInicio,
            duracao,
            cirurgioesSelecionados,
            statusId: statusSelecionado.id,
            hospitalId: hospitalSelecionado?.id,
            setorId: setorSelecionado?.id,
            salaDeCirurgiaId: salaDeCirurgiaSelecionada?.id

        };

        salvarDadosEtapa1(dadosEtapa1);
        irParaProximaEtapa();
    };

    const selecionarHospital = (id: number) => {
        const hospitalEscolhido = hospitais.find(h => h.id === id);
        setHospitalSelecionado(hospitalEscolhido);
        setMostrarModalHospital(false);
    
        SetorService.obterSetoresPorHospital(id.toString()).then(response => {
            setSetoresFiltrados(response);
        }).catch(error => {
            console.error('Erro ao buscar setores:', error);
        });
    };
    
    const selecionarSetor = (id: number) => {
        const setorEscolhido = setores.find(s => s.id === id);
        setSetorSelecionado(setorEscolhido);
        setMostrarModalSetor(false);
    
        SalaDeCirurgiaService.obterSalasDeCirurgiaPorSetor(id.toString()).then(response => {
            setSalasDeCirurgiaFiltradas(response);
        }).catch(error => {
            console.error('Erro ao buscar salas de cirurgia:', error);
        });
    };

    
    const selecionarSalaDeCirurgia = (id: number) => {
        const salaEscolhida = salasDeCirurgia.find(s => s.id === id);
        setSalaDeCirurgiaSelecionada(salaEscolhida);
        setMostrarModalSalaDeCirurgia(false);

    };
    
    
    useEffect(() => {
        HospitalService.obterHospitais().then(response => {
            setHospitais(response.data);
            
            const hospitalSaoLucas = response.data.find(h => h.nome === 'São Lucas');
            if (hospitalSaoLucas) {
                setHospitalSelecionado(hospitalSaoLucas);
                SetorService.obterSetoresPorHospital(hospitalSaoLucas.id.toString()).then(responseSetores => {
                    setSetoresFiltrados(responseSetores);
                });
            }
        }).catch(error => {
            console.error('Erro ao buscar hospitais:', error);
        });
    }, []);
    
    // useEffect para buscar os dados dos Setores
    useEffect(() => {
        SetorService.obterSetores().then(response => {
            setSetores(response.data);
        }).catch(error => {
            console.error('Erro ao buscar setores:', error);
        });
    }, []);
    
    // useEffect para buscar os dados das Salas de Cirurgia
    useEffect(() => {
        SalaDeCirurgiaService.obterSalasDeCirurgia().then(response => {
            setSalasDeCirurgia(response.data);
        }).catch(error => {
            console.error('Erro ao buscar salas de cirurgia:', error);
        });
    }, []);



    
    return (
        <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
            {/* Seletor de Hospital */}
            <Text style={styles.label}>Hospital</Text>
            <TouchableOpacity 
                onPress={() => setMostrarModalHospital(true)} 
                style={styles.inputSelector}
            >
                <Text style={styles.inputText}>
                    {hospitalSelecionado ? hospitalSelecionado.nome : "Selecione o hospital"}
                </Text>
            </TouchableOpacity>

            {/* Modal para Seleção de Hospital */}
            <ModalModelo
                isVisible={mostrarModalHospital}
                onDismiss={() => setMostrarModalHospital(false)}
                onItemSelected={selecionarHospital}
                items={hospitais.map(hospital => ({ id: hospital.id, label: hospital.nome }))}
                title="Selecione o Hospital"
            />

            {/* Contêiner para Setor e Sala de Cirurgia */}
            <View style={styles.dualInputContainer}>
                {/* Seletor de Setor */}
                <View style={styles.inputHalf}>
                    <Text style={styles.label}>Setor</Text>
                    <TouchableOpacity 
                        onPress={() => setMostrarModalSetor(true)} 
                        style={styles.inputSelector}
                    >
                        <Text style={styles.inputText}>
                            {setorSelecionado ? setorSelecionado.nome : "Selecione o setor"}
                        </Text>
                    </TouchableOpacity>

                    {/* Modal para Seleção de Setor */}
                    <ModalModelo
                        isVisible={mostrarModalSetor}
                        onDismiss={() => setMostrarModalSetor(false)}
                        onItemSelected={selecionarSetor}
                        items={setoresFiltrados.map(setor => ({ id: setor.id, label: setor.nome }))}
                        title="Selecione o Setor"
/>
                </View>

                {/* Seletor de Sala de Cirurgia */}
                <View style={styles.inputHalf}>
                    <Text style={styles.label}>Sala de Cirurgia</Text>
                    <TouchableOpacity 
                        onPress={() => setMostrarModalSalaDeCirurgia(true)} 
                        style={styles.inputSelector}
                    >
                        <Text style={styles.inputText}>
                            {salaDeCirurgiaSelecionada ? salaDeCirurgiaSelecionada.nome : "Selecione a sala"}
                        </Text>
                    </TouchableOpacity>

                    {/* Modal para Seleção de Sala de Cirurgia */}
                    <ModalModelo
                        isVisible={mostrarModalSalaDeCirurgia}
                        onDismiss={() => setMostrarModalSalaDeCirurgia(false)}
                        onItemSelected={selecionarSalaDeCirurgia}
                        items={salasDeCirurgiaFiltradas.map(sala => ({ id: sala.id, label: sala.nome }))}
                        title="Selecione a Sala de Cirurgia"
/>
                </View>
            </View>
    
            <Text style={styles.label}>Status</Text>
                <TouchableOpacity 
                    onPress={() => setMostrarModalStatus(true)} 
                    style={styles.inputSelector}
                >
                    <Text style={styles.inputText}>
                        {statusSelecionado.nome}
                    </Text>
                </TouchableOpacity>

                {/* Modal para Seleção de Status */}
                <ModalModelo
                    isVisible={mostrarModalStatus}
                    onDismiss={() => setMostrarModalStatus(false)}
                    onItemSelected={selecionarStatus}
                    items={status.map(s => ({ id: s.id, label: s.nome }))}
                    title="Selecione o Status"
                />

    
                <Text style={styles.label}>Data</Text>
                <TouchableOpacity 
                    onPress={() => setMostrarCalendario(true)} 
                    style={styles.inputSelector}
                >
                    <Text style={styles.inputText}>
                        {dataSelecionada || "Selecione a data"}
                    </Text>
                </TouchableOpacity>
    
                {mostrarCalendario && (
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={{
                            [dataSelecionada]: {selected: true, marked: true, selectedColor: 'blue'},
                        }}
                        style={styles.calendar}
                    />
                )}
    
                <Text style={styles.label}>Horário de Início</Text>
                <TextInput
                    value={horarioInicio}
                    onChangeText={(text) => formatarHorario(text, setHorarioInicio)}
                    placeholder="HH:MM"
                    style={styles.inputSelector}
                    keyboardType="numeric"
                />
    
                <Text style={styles.label}>Duração</Text>
                <TextInput
                    value={duracao}
                    onChangeText={(text) => formatarHorario(text, setDuracao)}
                    placeholder="HH:MM"
                    style={styles.inputSelector}
                    keyboardType="numeric"
                />
    
                <Text style={styles.label}>Cirurgiões</Text>
                <TouchableOpacity 
                    onPress={() => setMostrarModalCirurgioes(true)} 
                    style={styles.inputSelector}
                >
                    <View style={styles.cirurgioesContainer}>
                        {cirurgioesSelecionados.map(renderCirurgiaoBox)}
                    </View>
                </TouchableOpacity>
    
                <ModalCheckBox
                    isVisible={mostrarModalCirurgioes}
                    onDismiss={() => setMostrarModalCirurgioes(false)}
                    onItemSelected={selecionarCirurgiao}
                    items={cirurgioes.map(cirurgiao => ({ id: cirurgiao.id, label: cirurgiao.nome }))}
                    selectedItems={cirurgioesSelecionados}
                    title="Selecione os Cirurgiões"
                />
    
                <View style={styles.buttonContainer}>
                    <AppButton title="Cancelar" onPress={cancelarAgendamento} style={styles.cancelButton} />
                    <AppButton title="Próxima Etapa" onPress={salvarEtapa1} />
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
        calendar: {
            marginBottom: 20,
        },
        cirurgioesContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
        },
        cirurgiaoBox: {
            flexDirection: 'row',
            backgroundColor: 'white',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            padding: 3,
            marginRight: 2,
            marginTop: 2,
            marginBottom: 2
        },
        cirurgiaoBoxText: {
            fontSize: 14,
            marginRight: 5,
            color: 'black',
        },
        cirurgiaoBoxRemove: {
            backgroundColor: 'red',
            height: 12,
            borderRadius: 5,
            padding: 2,
            alignItems: 'center',
        },
        cirurgiaoBoxRemoveText: {
            color: 'white',
            fontSize: 10,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
        },
        cancelButton: {
            backgroundColor: '#e57373', // Um tom de vermelho claro
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20
            ,
        },
        dualInputContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        inputHalf: {
            width: '48%', // Aproximadamente metade da largura para duas colunas
        },
    });
    
    export default Etapa1Agendamento;
    
