
import React, { useState, useEffect } from 'react';
import { useAgendamento } from '../../context/AgendamentoContext';
import { View, StyleSheet, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ModalCheckBox from '../../componentes/models/ModalCheckBox';
import * as CirurgiaoService from '../../services/CirurgiaoService';

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
    const { salvarDadosEtapa1 } = useAgendamento();



    

    useEffect(() => {
        CirurgiaoService.obterCirurgioes().then(response => {
            setCirurgioes(response.data);
        }).catch(error => {
            console.error('Erro ao buscar cirurgiões:', error);
        });
    }, []);

    

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
            cirurgioesSelecionados
        };

        salvarDadosEtapa1(dadosEtapa1);
        irParaProximaEtapa();
    };

    
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
        
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
                    
                        <AppButton title="Cancelar" onPress={() => navigation.goBack()} />
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
            alignItems: 'center',
        },
        cirurgiaoBox: {
            flexDirection: 'row',
            backgroundColor: '#e1e1e1',
            borderRadius: 5,
            padding: 5,
            marginRight: 5,
            marginTop: 5,
        },
        cirurgiaoBoxText: {
            fontSize: 14,
            marginRight: 5,
            color: 'black',
        },
        cirurgiaoBoxRemove: {
            backgroundColor: 'red',
            borderRadius: 10,
            padding: 2,
        },
        cirurgiaoBoxRemoveText: {
            color: 'white',
            fontSize: 12,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
    });
    
    export default Etapa1Agendamento;
    
