
import React, { useState, useEffect } from 'react';
import { useAgendamento } from '../../context/AgendamentoContext';
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
import { DadosEtapa1 } from '../../types/types';


import ModalModelo from '../../componentes/models/ModalModelo';
 // Importe o serviço de statusa


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
    const [caraterprocedimento, setcaraterprocedimento] = useState('');
    const [tipoprocedimento, settipoprocedimento] = useState('');
    const [tentativaSubmissao, setTentativaSubmissao] = useState(false);
    const [estaAvancando, setEstaAvancando] = useState(false);

    const onChangeHorarioInicio = (text: string) => {
        setHorarioInicio(text);
        setErros(prevErros => ({ ...prevErros, horarioInicio: !text }));
    };
    
    const onChangeDuracao = (text: string) => {
        setDuracao(text);
        setErros(prevErros => ({ ...prevErros, duracao: !text }));
    };   

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
            console.log("Dados da etapa 1 recebidos no componente:", dadosEtapa1);
    
            // Verificações para garantir que não estamos definindo estados com undefined
            if (dadosEtapa1.dataSelecionada) setDataSelecionada(dadosEtapa1.dataSelecionada);
            if (dadosEtapa1.horarioInicio) setHorarioInicio(dadosEtapa1.horarioInicio);
            if (dadosEtapa1.duracao) setDuracao(dadosEtapa1.duracao);
            if (dadosEtapa1.cirurgioesSelecionados) setCirurgioesSelecionados(dadosEtapa1.cirurgioesSelecionados);
            if (dadosEtapa1.caraterprocedimento) setcaraterprocedimento(dadosEtapa1.caraterprocedimento);
            if (dadosEtapa1.tipoprocedimento) settipoprocedimento(dadosEtapa1.tipoprocedimento);
    
            const statusEncontrado = status.find(s => s.id === dadosEtapa1.statusId);
            if (statusEncontrado) setStatusSelecionado(statusEncontrado);
    
            const hospitalEncontrado = hospitais.find(h => h.id === dadosEtapa1.hospitalId);
            if (hospitalEncontrado) setHospitalSelecionado(hospitalEncontrado);
    
            const setorEncontrado = setores.find(s => s.id === dadosEtapa1.setorId);
            if (setorEncontrado) setSetorSelecionado(setorEncontrado);
    
            const salaEncontrada = salasDeCirurgia.find(s => s.id === dadosEtapa1.salaDeCirurgiaId);
            if (salaEncontrada) setSalaDeCirurgiaSelecionada(salaEncontrada);
        }
    }, [dadosEtapa1, status, hospitais, setores, salasDeCirurgia]);
    

    useEffect(() => {
        console.log("Estado de 'estaAvancando' alterado para:", estaAvancando);
    }, [estaAvancando]);
    
    
    useEffect(() => {
        console.log("useEffect em Etapa1Agendamento: dadosEtapa1 atualizados, estaAvancando:", estaAvancando);

        if (dadosEtapa1 && estaAvancando) {
            irParaProximaEtapa();
        }
    }, [dadosEtapa1, estaAvancando, irParaProximaEtapa]);

    useEffect(() => {
        CirurgiaoService.obterCirurgioes().then(response => {
            console.log("Cirurgiões carregados:", response.data); // Adicione este log

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

    

    const selecionarStatus = (id: number) => {
        console.log("selecionarStatus chamada com:", id);

        const statusEscolhido = status.find(s => s.id === id);
        setStatusSelecionado(statusEscolhido);
        setMostrarModalStatus(false);
        setErros(prevErros => ({ ...prevErros, status: !statusEscolhido }));
    
    };
    

    const onDayPress = (day: { dateString: string }) => {
        const [year, month, dayOfMonth] = day.dateString.split('-');
        const formattedDate = `${dayOfMonth}/${month}/${year}`;
        console.log("Data selecionada:", formattedDate);
        setDataSelecionada(formattedDate);
        setMostrarCalendario(false);
        setErros(prevErros => ({ ...prevErros, data: !formattedDate }));
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
        const novosSelecionados = jaSelecionado 
            ? cirurgioesSelecionados.filter(item => item !== id) 
            : [...cirurgioesSelecionados, id];
        console.log("Cirurgião selecionado/desselecionado:", id, "Novos selecionados:", novosSelecionados);
        setCirurgioesSelecionados(novosSelecionados);
        setErros(prevErros => ({ ...prevErros, cirurgioes: novosSelecionados.length === 0 }));
    };

    const removerCirurgiao = (id: number) => {
        setCirurgioesSelecionados(cirurgioesSelecionados.filter(item => item !== id));
    };

    const renderCirurgiaoBox = (id: number) => {
        const cirurgiao = cirurgioes.find(c => c.id === id);

        if (!cirurgiao) {
            return null; // Ou renderize algo que indique que o cirurgião não foi encontrado
        }
    
        return (
            <View key={id.toString()} style={styles.cirurgiaoBox}>
                <Text style={styles.cirurgiaoBoxText}>{cirurgiao.nome}</Text>
                <TouchableOpacity onPress={() => removerCirurgiao(id)} style={styles.cirurgiaoBoxRemove}>
                    <Text style={styles.cirurgiaoBoxRemoveText}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };
    
    const selecionarcaraterprocedimento = (valor: string) => {
        console.log("selecionarcaraterprocedimento chamada com:", valor);
        setcaraterprocedimento(valor);
        setErros(prevErros => ({ ...prevErros, caraterprocedimento: !valor }));
    };

    const selecionartipoprocedimento = (valor: string) => {
        settipoprocedimento(valor);
        setErros(prevErros => ({ ...prevErros, tipoprocedimento: !valor }));
    };
    

    

    useEffect(() => {
        const verificarErrosIniciais = () => {
            setErros({
                caraterprocedimento: tentativaSubmissao && caraterprocedimento === '',
                tipoprocedimento: tentativaSubmissao && tipoprocedimento === '',
                hospital: tentativaSubmissao && hospitalSelecionado === null,
                setor: tentativaSubmissao && setorSelecionado === null,
                status: tentativaSubmissao && statusSelecionado === null,
                data: tentativaSubmissao && dataSelecionada === '',
                duracao: tentativaSubmissao && duracao === '',
                cirurgioes: tentativaSubmissao && cirurgioesSelecionados.length === 0,
            });
        };
    
        verificarErrosIniciais();
    }, [tentativaSubmissao, caraterprocedimento, tipoprocedimento, hospitalSelecionado, setorSelecionado, statusSelecionado, dataSelecionada, duracao, cirurgioesSelecionados]);
    
    
    const temErro = (campo: keyof typeof erros) => {
        return tentativaSubmissao && erros[campo];
    };
    
    const [erros, setErros] = useState({
        caraterprocedimento: false,
        tipoprocedimento: false,
        hospital: false,
        setor: false,
        status: false,
        data: false,
        duracao: false,
        cirurgioes: false,
    });

    const nomesCampos = {
        caraterprocedimento: "Caráter do Procedimento",
        tipoprocedimento: "Tipo de Atendimento",
        hospital: "Hospital",
        setor: "Setor",
        status: "Status",
        data: "Data",
        duracao: "Duração",
        cirurgioes: "Cirurgiões",
    };




    const salvarEtapa1 = () => {
        
       
        setTentativaSubmissao(true); // Ativa a flag de tentativa de submissão

        console.log("Estado atual dos campos:", { caraterprocedimento, tipoprocedimento, hospitalSelecionado, setorSelecionado, statusSelecionado, dataSelecionada, duracao, cirurgioesSelecionados });


        let novosErros = {
        caraterprocedimento: !caraterprocedimento,
        tipoprocedimento: !tipoprocedimento,
        hospital: !hospitalSelecionado,
        setor: !setorSelecionado,
        status: !statusSelecionado,
        data: !dataSelecionada,
        duracao: !duracao,
        cirurgioes: cirurgioesSelecionados.length === 0,
    };

    console.log("Novos erros identificados:", novosErros);


    setErros(novosErros);

    // Verifica se algum campo obrigatório está vazio
    if (Object.values(novosErros).some(erro => erro)) {
        let camposComErro = Object.keys(novosErros)
            .filter(campo => novosErros[campo as keyof typeof novosErros])
            .map(campo => nomesCampos[campo as keyof typeof nomesCampos]);

        Alert.alert(
            "Erro",
            "Por favor, preencha os seguintes campos:\n" + 
            camposComErro.map(campo => `- ${campo}`).join('\n'),
            [{ text: "OK", style: "cancel" }]
        );
        return;
    }

        const dadosEtapa1 = {
            dataSelecionada,
            horarioInicio,
            duracao,
            cirurgioesSelecionados,
            statusId: statusSelecionado.id,
            hospitalId: hospitalSelecionado?.id,
            setorId: setorSelecionado?.id,
            salaDeCirurgiaId: salaDeCirurgiaSelecionada?.id,
            caraterprocedimento, // Novo campo adicionado
            tipoprocedimento, // Novo campo adicionado

        };

        console.log("Dados sendo salvos na Etapa 1:", dadosEtapa1);
        setEstaAvancando(true); // Adicione esta linha
        salvarDadosEtapa1(dadosEtapa1);
    };

    const selecionarHospital = (id: number) => {
        const hospitalEscolhido = hospitais.find(h => h.id === id);
        console.log("Hospital selecionado:", hospitalEscolhido);
        setHospitalSelecionado(hospitalEscolhido);
        setMostrarModalHospital(false);
        setErros(prevErros => ({ ...prevErros, hospital: !hospitalEscolhido }));
    

            
        SetorService.obterSetoresPorHospital(id.toString()).then(response => {
            setSetoresFiltrados(response);
        }).catch(error => {
            console.error('Erro ao buscar setores:', error);
        });
    };
    
    const selecionarSetor = (id: number) => {
        const setorEscolhido = setores.find(s => s.id === id);
        console.log("Setor selecionado:", setorEscolhido);
        setSetorSelecionado(setorEscolhido);
        setMostrarModalSetor(false);
        setErros(prevErros => ({ ...prevErros, setor: !setorEscolhido }));
    
        SalaDeCirurgiaService.obterSalasDeCirurgiaPorSetor(id.toString()).then(response => {
            setSalasDeCirurgiaFiltradas(response);
        }).catch(error => {
            console.error('Erro ao buscar salas de cirurgia:', error);
        });
    };

    
    const selecionarSalaDeCirurgia = (id: number) => {
        const salaEscolhida = salasDeCirurgia.find(s => s.id === id);
        console.log("Sala de cirurgia selecionada:", salaEscolhida);
        setSalaDeCirurgiaSelecionada(salaEscolhida);
        setMostrarModalSalaDeCirurgia(false);
        setErros(prevErros => ({ ...prevErros, salaDeCirurgia: !salaEscolhida }));
    };
    
    
    useEffect(() => {
        HospitalService.obterHospitais().then(response => {
            setHospitais(response.data);
            
            const hospitalSaoLucas = response.data.find((h: any) => h.nome === 'São Lucas');
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

<Text style={styles.label}>Caráter do Procedimento</Text>
<View style={[styles.opcoesContainer, temErro('caraterprocedimento') && styles.inputError]}>
    {['Eletivo', 'Urgência', 'Emergência'].map((opcao) => (
        <TouchableOpacity
            key={opcao}
            style={[
                styles.opcao,
                caraterprocedimento === opcao && styles.opcaoSelecionada,
                temErro('caraterprocedimento') && styles.opcaoErro // Adicione esta linha
            ]}
            onPress={() => selecionarcaraterprocedimento(opcao)}
        >
            <Text style={[
                styles.opcaoTexto,
                caraterprocedimento === opcao && styles.opcaoTextoSelecionado
            ]}>
                {opcao}
            </Text>
        </TouchableOpacity>
    ))}
</View>

<View style={[styles.opcoesContainer, temErro('tipoprocedimento') && styles.inputError]}>
    {['Ambulatorial', 'Hospitalar', 'Indefinido'].map((opcao) => (
        <TouchableOpacity
            key={opcao}
            style={[
                styles.opcao,
                tipoprocedimento === opcao && styles.opcaoSelecionada,
                temErro('tipoprocedimento') && styles.opcaoErro // Adicione esta linha
            ]}
            onPress={() => selecionartipoprocedimento(opcao)}
        >
            <Text style={[
                styles.opcaoTexto,
                tipoprocedimento === opcao && styles.opcaoTextoSelecionado
            ]}>
                {opcao}
            </Text>
        </TouchableOpacity>
    ))}
</View>

        <View style={styles.container}>
            {/* Seletor de Hospital */}
            <Text style={styles.label}>Hospital</Text>
            <TouchableOpacity 
                onPress={() => setMostrarModalHospital(true)} 
                style={[styles.inputSelector, temErro('hospital') && styles.inputError]}
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
                        style={[styles.inputSelector, temErro('setor') && styles.inputError]}
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
                    style={[styles.inputSelector, temErro('status') && styles.inputError]}
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
                    style={[styles.inputSelector, erros.data && styles.inputError]}
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
                    style={[styles.inputSelector, erros.duracao && styles.inputError]}
                    keyboardType="numeric"
                />
    
                <Text style={styles.label}>Cirurgiões</Text>
                <TouchableOpacity 
                    onPress={() => setMostrarModalCirurgioes(true)} 
                    style={[styles.inputSelector, temErro('cirurgioes') && styles.inputError]}
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
        opcoesContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        opcao: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            width: '30%', // Aproximadamente um terço da largura para três colunas
        },
        opcaoSelecionada: {
            backgroundColor: 'black', // Cor de fundo para opção selecionada
        },
        opcaoTexto: {
            textAlign: 'center',
            color: 'black',
        },
        opcaoTextoSelecionado: {
            color: 'white',
            fontWeight: 'bold',
        },
        inputError: {
            borderColor: 'red',
        },
        opcaoErro: {
            borderColor: 'red',
        },
    });
    
    export default Etapa1Agendamento;
    
