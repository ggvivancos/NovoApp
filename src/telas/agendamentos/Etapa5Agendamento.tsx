import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import ModalCheckBox from '../../componentes/models/ModalCheckBox';
import * as OPMEService from '../../services/OPMEService';
import * as FornecedorService from '../../services/FornecedorService';
import { useAgendamento } from '../../context/AgendamentoContext';
import * as RecursoComplementarService from '../../services/RecursoComplementarService';
import * as FioService from '../../services/FioService';
import * as InstrumentalService from '../../services/InstrumentalService';


import { InstrumentalData } from '../../types/InstrumentalData';
import { OPMEData } from '../../types/OPMEData';
import { FornecedorData } from '../../types/FornecedorData';
import { FioAgendamentoData } from '../../types/FioAgendamentoData';




interface Etapa5Props {
    irParaProximaEtapa: () => void;
    irParaEtapaAnterior: () => void;
}











const Etapa5Agendamento: React.FC<Etapa5Props> = ({ irParaProximaEtapa, irParaEtapaAnterior }) => {
    const navigation = useNavigation();
    const [materiaisEspeciais, setMateriaisEspeciais] = useState<number[]>([]);
    const [opmes, setOpmes] = useState<OPMEData[]>([]);
    const [fornecedores, setFornecedores] = useState<FornecedorData[]>([]);
    const [opmesSelecionadas, setOpmesSelecionadas] = useState<OPMEData[]>([]);
    const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<FornecedorData[]>([]);
    const [mostrarModalOpme, setMostrarModalOpme] = useState(false);
    const [mostrarModalFornecedor, setMostrarModalFornecedor] = useState(false);
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, salvarDadosEtapa5 } = useAgendamento();
    const [recursosComplementares, setRecursosComplementares] = useState([]);
    const { limparDadosAgendamento } = useAgendamento();
    const [etapaPreparada, setEtapaPreparada] = useState(false);
    const [instrumentais, setInstrumentais] = useState<InstrumentalData[]>([]);
    const [fios, setFios] = useState<FioAgendamentoData[]>([]);
    const [instrumentaisSelecionados, setInstrumentaisSelecionados] = useState<InstrumentalData[]>([]);
    const [fiosSelecionados, setFiosSelecionados] = useState<FioAgendamentoData[]>([]);
    const [mostrarModalInstrumental, setMostrarModalInstrumental] = useState(false);
    const [mostrarModalFio, setMostrarModalFio] = useState(false);
    const [observacoes, setObservacoes] = useState('');
    const [fiosComQuantidade, setFiosComQuantidade] = useState<FioAgendamentoData[]>([]);

    
    useEffect(() => {
        console.log('Dados Etapa 5 do Contexto:', dadosEtapa5);
    }, [dadosEtapa5]);

    

    

    useEffect(() => {
        if (dadosEtapa5 && opmes && fornecedores && instrumentais && fios) {
            const opmesSelecionadasCompleto = dadosEtapa5.opmesSelecionadas
                .map(id => opmes.find(opme => opme.id === id))
                .filter(Boolean) as OPMEData[]; // Filter out undefined values and cast to OPMEData[]
    
            const fornecedoresSelecionadosCompleto = dadosEtapa5.fornecedoresSelecionados
                .map(id => fornecedores.find(fornecedor => fornecedor.id === id))
                .filter(Boolean) as FornecedorData[]; // Filter out undefined values and cast to FornecedorData[]
    
            const instrumentaisSelecionadosCompleto = dadosEtapa5.instrumentaisSelecionados
                .map(id => instrumentais.find(instrumental => instrumental.id === id))
                .filter(Boolean) as InstrumentalData[]; // Filter out undefined values and cast to InstrumentalData[]
    
                
                
                                

    
            // Assuming recursosComplementares and observacoes are array of IDs and a string respectively
            const recursosComplementaresSelecionados = dadosEtapa5.materiaisEspeciais ?? [];
            const observacoes = dadosEtapa5.observacoes ?? '';
    
            setOpmesSelecionadas(opmesSelecionadasCompleto);
            setFornecedoresSelecionados(fornecedoresSelecionadosCompleto);
            setInstrumentaisSelecionados(instrumentaisSelecionadosCompleto);
            setMateriaisEspeciais(recursosComplementaresSelecionados);
            setObservacoes(observacoes);
            // Update other states as necessary
        }
    }, [dadosEtapa5, opmes, fornecedores, instrumentais, fios, fiosComQuantidade]);

    useEffect(() => {
        console.log("Debug: Iniciando useEffect para processar fiosComQuantidade.");
    
        if (!dadosEtapa5 || !dadosEtapa5.fiosComQuantidade) {
            console.log("Debug: dadosEtapa5 ou fiosComQuantidade é undefined ou null");
            return; // Sai cedo se os dados não estiverem prontos
        }
    
        // Já que dadosEtapa5.fiosComQuantidade agora segue a nova estrutura,
        // você pode diretamente ajustar para refletir isso na renderização ou outro processamento necessário.
        // Não há necessidade de mapear ou buscar `fioId` como antes.
        const fiosComQuantidadeAjustados = dadosEtapa5.fiosComQuantidade.map(fio => ({
            ...fio, // Espalha as propriedades existentes do fio
            quantidadeNecessaria: fio.AgendamentoFios?.quantidadeNecessaria || 0, // Garante que quantidadeNecessaria esteja definida
        }));
    
        console.log("Debug: fiosComQuantidadeAjustados para renderização", fiosComQuantidadeAjustados);
    
        setFiosComQuantidade(fiosComQuantidadeAjustados);

    }, [dadosEtapa5]);
    
    
      
      
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
        OPMEService.obterOPMEs().then(response => {
            setOpmes(response.data);
        });
        FornecedorService.obterFornecedores().then(response => {
            setFornecedores(response.data);
        });
        RecursoComplementarService.obterRecursosComplementares().then(response => {
            setRecursosComplementares(response.data);
        });
        InstrumentalService.obterInstrumentais().then(response => {
            setInstrumentais(response.data);
        });
        FioService.obterFios().then(response => {
            setFios(response.data);
        });

    }, []);
  

    const selecionarMaterial = (id: number) => {
        if (materiaisEspeciais.includes(id)) {
            setMateriaisEspeciais(materiaisEspeciais.filter(item => item !== id));
        } else {
            setMateriaisEspeciais([...materiaisEspeciais, id]);
        }
    };

    const renderMaterialBox = (recurso: { id: number; recurso: string }) => {
        const isSelected = materiaisEspeciais.includes(recurso.id);
        return (
            <TouchableOpacity
                key={recurso.id}
                style={[
                    styles.materialOpcao,
                    isSelected && styles.materialOpcaoSelecionada
                ]}
                onPress={() => selecionarMaterial(recurso.id)}
            >
                <Text style={[
                    styles.materialTexto,
                    isSelected && styles.materialTextoSelecionado
                ]}>{recurso.recurso}</Text>
            </TouchableOpacity>
        );
    };

    const abrirModalOpme = () => setMostrarModalOpme(true);
    const fecharModalOpme = () => setMostrarModalOpme(false);
    const selecionarOpme = (id: number) => {
        const jaSelecionadoIndex = opmesSelecionadas.findIndex(item => item.id === id);
        if (jaSelecionadoIndex !== -1) {
            setOpmesSelecionadas(opmesSelecionadas.filter((_, index) => index !== jaSelecionadoIndex));
        } else {
            const opme = opmes.find(opme => opme.id === id);
            if (opme) {
                setOpmesSelecionadas([...opmesSelecionadas, opme]);
            }
        }
    };

    const abrirModalFornecedor = () => setMostrarModalFornecedor(true);
    const fecharModalFornecedor = () => setMostrarModalFornecedor(false);
    const selecionarFornecedor = (id: number) => {
        const jaSelecionadoIndex = fornecedoresSelecionados.findIndex(item => item.id === id);
        if (jaSelecionadoIndex !== -1) {
            setFornecedoresSelecionados(fornecedoresSelecionados.filter((_, index) => index !== jaSelecionadoIndex));
        } else {
            const fornecedor = fornecedores.find(fornecedor => fornecedor.id === id);
            if (fornecedor) {
                setFornecedoresSelecionados([...fornecedoresSelecionados, fornecedor]);
            }
        }
    };

    const abrirModalInstrumental = () => setMostrarModalInstrumental(true);
    const fecharModalInstrumental = () => setMostrarModalInstrumental(false);
    const selecionarInstrumental = (id: number) => {
        const jaSelecionadoIndex = instrumentaisSelecionados.findIndex(item => item.id === id);
        if (jaSelecionadoIndex !== -1) {
            setInstrumentaisSelecionados(instrumentaisSelecionados.filter((_, index) => index !== jaSelecionadoIndex));
        } else {
            const instrumental = instrumentais.find(instrumental => instrumental.id === id);
            if (instrumental) {
                setInstrumentaisSelecionados([...instrumentaisSelecionados, instrumental]);
            }
        }
    }
        

    const abrirModalFio = () => setMostrarModalFio(true);
    const fecharModalFio = () => setMostrarModalFio(false);
    const selecionarFio = (id: number) => {
    const fioExistenteIndex = fiosComQuantidade.findIndex(fio => fio.id === id);
    if (fioExistenteIndex >= 0) {
        // Atualiza a quantidade necessária se o fio já foi selecionado antes
        const fiosAtualizados = fiosComQuantidade.map((fio, index) => {
            if (index === fioExistenteIndex) {
                return {
                    ...fio,
                    AgendamentoFios: {
                        // Aqui garantimos que a quantidade necessária é incrementada corretamente
                        quantidadeNecessaria: fio.AgendamentoFios.quantidadeNecessaria + 1
                    }
                };
            }
            return fio;
        });
        setFiosComQuantidade(fiosAtualizados);
    } else {
        // Fio não selecionado, adicionar com quantidade inicial de 1
        const fioEncontrado = fios.find(fio => fio.id === id);
        if (fioEncontrado) {
            setFiosComQuantidade([...fiosComQuantidade, {
                id: fioEncontrado.id,
                nome: fioEncontrado.nome, // Supondo que 'nome' está disponível na lista 'fios'
                AgendamentoFios: {
                    quantidadeNecessaria: 1 // Define a quantidade inicial como 1
                }
            }]);
        }
    }
};

    
    
      
    
    

    const renderOpmeBox = (opme: OPMEData) => (
        <View key={opme.id} style={styles.itemBox}>
            <Text style={styles.itemBoxText}>{opme.nome}</Text>
            <TouchableOpacity onPress={() => selecionarOpme(opme.id)} style={styles.itemBoxRemove}>
                <Text style={styles.itemBoxRemoveText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFornecedorBox = (fornecedor: FornecedorData) => (
        <View key={fornecedor.id} style={styles.itemBox}>
            <Text style={styles.itemBoxText}>{fornecedor.nome}</Text>
            <TouchableOpacity onPress={() => selecionarFornecedor(fornecedor.id)} style={styles.itemBoxRemove}>
                <Text style={styles.itemBoxRemoveText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    const renderInstrumentalBox = (instrumental: InstrumentalData) => (
        <View key={instrumental.id} style={styles.itemBox}>
            <Text style={styles.itemBoxText}>{instrumental.nome}</Text>
            <TouchableOpacity onPress={() => selecionarInstrumental(instrumental.id)} style={styles.itemBoxRemove}>
                <Text style={styles.itemBoxRemoveText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFioComQuantidade = () => {
        return fiosComQuantidade.map((fio) => (
            <View key={fio.id} style={styles.fioContainer}>
                <Text style={styles.fioNome}>{fio.nome}</Text>
                {/* Acesso à quantidadeNecessaria aninhada dentro de AgendamentoFios */}
                <View style={styles.quantidadeContainer}>
                    <TouchableOpacity onPress={() => decrementarQuantidadeFio(fio.id)} style={styles.botaoQuantidade}>
                        <Text style={styles.botaoTexto}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.fioQuantidadeInput}
                        value={String(fio.AgendamentoFios.quantidadeNecessaria)}
                        onChangeText={(text) => ajustarQuantidadeFio(fio.id, parseInt(text) || 0)}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={() => incrementarQuantidadeFio(fio.id)} style={styles.botaoQuantidade}>
                        <Text style={styles.botaoTexto}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removerFio(fio.id)} style={styles.botaoRemoverFio}>
                    <Text style={styles.botaoTexto}>X</Text>
                </TouchableOpacity>
            </View>
        ));
    };
    
    // Função para incrementar a quantidade
    const incrementarQuantidadeFio = (fioId: number) => {
        setFiosComQuantidade(fiosComQuantidade.map(fio => 
            fio.id === fioId ? {...fio, AgendamentoFios: {...fio.AgendamentoFios, quantidadeNecessaria: fio.AgendamentoFios.quantidadeNecessaria + 1}} : fio
        ));
    };
    
    // Função para decrementar a quantidade
    const decrementarQuantidadeFio = (fioId: number) => {
        setFiosComQuantidade(fiosComQuantidade.map(fio => 
            fio.id === fioId ? {...fio, AgendamentoFios: {...fio.AgendamentoFios, quantidadeNecessaria: Math.max(1, fio.AgendamentoFios.quantidadeNecessaria - 1)}} : fio
        ));
    };
    
    // Função para ajustar a quantidade baseada no input do usuário
    const ajustarQuantidadeFio = (id: number, quantidade: number) => {
        setFiosComQuantidade(prev => 
            prev.map(fio => fio.id === id ? { ...fio, AgendamentoFios: {...fio.AgendamentoFios, quantidadeNecessaria: quantidade}} : fio)
        );
    };
    
    // Função para remover um fio da lista
    const removerFio = (fioId: number) => {
        setFiosComQuantidade(fiosComQuantidade.filter(fio => fio.id !== fioId));
    };
    
      
      
    
    

    const salvarEtapa5EPreparar = () => {
        const dadosEtapa5 = {
            materiaisEspeciais,
            opmesSelecionadas: opmesSelecionadas.map(opme => opme.id),
            fornecedoresSelecionados: fornecedoresSelecionados.map(fornecedor => fornecedor.id),
            instrumentaisSelecionados: instrumentaisSelecionados.map(instrumental => instrumental.id),
            fiosComQuantidade: fiosComQuantidade.map(fio => ({
                id: fio.id,
                nome: fio.nome, // Supondo que você tenha o 'nome' disponível aqui. Se não, precisará ajustar conforme sua fonte de dados.
                AgendamentoFios: {
                    quantidadeNecessaria: fio.AgendamentoFios.quantidadeNecessaria
                }
            })),
            observacoes, // Adicione esta linha
            };

        console.log("Salvando dados da Etapa 5:", dadosEtapa5);
        salvarDadosEtapa5(dadosEtapa5);
        setEtapaPreparada(true); // Indica que a etapa está pronta para avançar
    };

    useEffect(() => {
        if (etapaPreparada) {
            setTimeout(() => {
                // Aqui você pode optar por salvar novamente se necessário
                // Como os dados já foram salvos acima, isso pode ser opcional
                console.log("Dados da Etapa 5 salvos novamente, avançando para a próxima etapa.");
                irParaProximaEtapa();
                setEtapaPreparada(false); // Reseta o estado para evitar repetições
            }, 50); // Ajuste este tempo conforme necessário
        }
    }, [etapaPreparada, irParaProximaEtapa]);
    


        const renderizarOpmeModal = () => (
            <ModalCheckBox
                isVisible={mostrarModalOpme}
                onDismiss={fecharModalOpme}
                onItemSelected={selecionarOpme}
                items={opmes.map(opme => ({
                    id: opme.id,
                    label: opme.nome
                }))}
                selectedItems={opmesSelecionadas.map(opme => opme.id)}
                title="Selecione as OPMEs"
            />
        );
    
        const renderizarFornecedorModal = () => (
            <ModalCheckBox
                isVisible={mostrarModalFornecedor}
                onDismiss={fecharModalFornecedor}
                onItemSelected={selecionarFornecedor}
                items={fornecedores.map(fornecedor => ({
                    id: fornecedor.id,
                    label: fornecedor.nome
                }))}
                selectedItems={fornecedoresSelecionados.map(fornecedor => fornecedor.id)}
                title="Selecione os Fornecedores"
            />
        );

        const renderizarModalInstrumental = () => (
            <ModalCheckBox
                isVisible={mostrarModalInstrumental}
                onDismiss={fecharModalInstrumental}
                onItemSelected={selecionarInstrumental}
                items={instrumentais.map(instrumental => ({
                    id: instrumental.id,
                    label: instrumental.nome
                }))}
                selectedItems={instrumentaisSelecionados.map(instrumental => instrumental.id)}
                title="Selecione Instrumentais"
            />
        );
        
        

        const renderizarModalFio = () => (
            <ModalCheckBox
                isVisible={mostrarModalFio}
                onDismiss={fecharModalFio}
                onItemSelected={selecionarFio}
                items={fios.map(fio => ({
                    id: fio.id,
                    label: fio.nome
                }))}
                selectedItems={fiosComQuantidade.map(fio => fio.id)} // Ajustado para usar fiosComQuantidade
                title="Selecione Fios"
            />
        );
        
    
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                            
                    <Text style={styles.label}>Recursos Complementares</Text>
                    <View style={styles.materiaisOpcoes}>
                        {recursosComplementares.map(renderMaterialBox)}
                    </View>
        
                    <Text style={styles.label}>OPMEs</Text>
                    <TouchableOpacity onPress={abrirModalOpme} style={styles.inputSelector}>
                        <View style={styles.itemsContainer}>
                            {opmesSelecionadas.length > 0 ? 
                                opmesSelecionadas.map(renderOpmeBox) :
                                <Text style={styles.placeholder}>Selecione as OPMEs</Text>
                            }
                        </View>
                    </TouchableOpacity>
        
                    <Text style={styles.label}>Fornecedores</Text>
                    <TouchableOpacity onPress={abrirModalFornecedor} style={styles.inputSelector}>
                        <View style={styles.itemsContainer}>
                            {fornecedoresSelecionados.length > 0 ? 
                                fornecedoresSelecionados.map(renderFornecedorBox) :
                                <Text style={styles.placeholder}>Selecione os Fornecedores</Text>
                            }
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.label}>Instrumentais</Text>
                    <TouchableOpacity onPress={abrirModalInstrumental} style={styles.inputSelector}>
                        <View style={styles.itemsContainer}>
                            {instrumentaisSelecionados.length > 0 ?
                                instrumentaisSelecionados.map(renderInstrumentalBox) :
                                <Text style={styles.placeholder}>Selecione Instrumentais</Text>
                            }
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.label}>Fios</Text>
                    <TouchableOpacity onPress={abrirModalFio} style={styles.inputSelector}>
                        <View style={styles.itemsContainer}>
                            {fiosComQuantidade.length > 0 ?
                                renderFioComQuantidade() : // Esta chamada substitui a renderização anterior
                                <Text style={styles.placeholder}>Selecione Fios</Text>
                            }
                        </View>
                    </TouchableOpacity>

                    {renderizarOpmeModal()}
                    {renderizarFornecedorModal()}        
                    {renderizarModalInstrumental()}        
                    {renderizarModalFio()}


                    <Text style={styles.label}>Observações</Text>
                    <TextInput
                        style={styles.inputObservacoes}
                        placeholder="Digite suas observações aqui"
                        multiline
                        numberOfLines={4}
                        onChangeText={setObservacoes}
                        value={observacoes}
                    />
        
                    <View style={styles.buttonContainer}>
                        <AppButton title="Etapa Anterior" onPress={irParaEtapaAnterior} />
                        <AppButton title="Cancelar" onPress={cancelarAgendamento} style={styles.cancelButton} />
                        <AppButton title="Próxima Etapa" onPress={salvarEtapa5EPreparar} />
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
            padding: 10,
        },
        label: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 5,
            color: '#333',
        },
        materiaisOpcoes: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 10,
            alignItems: 'center'
        },
        materialOpcao: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            marginBottom: 10,
            width: '31%',
            alignItems: 'center',
            height: 55,
            justifyContent: 'center',
            
        },
        materialOpcaoSelecionada: {
            backgroundColor: 'black',
        },
        materialTexto: {
            textAlign: 'center',
            color: 'black',
            alignItems: 'center'
        },
        materialTextoSelecionado: {
            color: 'white',
            fontWeight: 'bold',
            alignItems: 'center'
        },
        inputSelector: {
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 10,
            marginBottom: 20,
            borderRadius: 10,
            backgroundColor: '#f5f5f5',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 10,
            flexWrap: 'wrap',
        },
        inputText: {
            color: '#888',
        },
        itemsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
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
            marginBottom: 2
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
        cancelButton: {
            backgroundColor: '#e57373',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#333',
            textAlign: 'center'
        },
        placeholder: {
            color: '#888',
            fontStyle: 'italic',
        },
        inputObservacoes: {
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 10,
            marginBottom: 20,
            borderRadius: 5,
            backgroundColor: '#f5f5f5',
        },
        
          
          fioContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          },
          fioNome: {
            flex: 1,
          },
          quantidadeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          botaoQuantidade: {
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            
            
            backgroundColor: 'black', // Fundo preto
            borderWidth: 1,
            borderColor: 'black', // Mantendo a borda preta para uniformidade
            borderRadius: 15, // Metade da largura/altura para tornar o botão circular
            marginHorizontal: 5,
          },
          botaoTexto: {
            fontSize: 22, // Aumentado para tornar o "+" e "-" maiores
            fontWeight: 'bold',
            color: 'white',
          },
          fioQuantidadeInput: {
            width: 50,
            textAlign: 'center',
            borderColor: '#ccc', // Adiciona cor à borda para destacar a entrada de texto
            borderWidth: 1,
            borderRadius: 5, // Adiciona bordas levemente arredondadas à entrada de texto
            fontSize: 20, // Aumentado para tornar o texto da quantidade maior

          },
          botaoRemoverFio: {
            width: 30, // Igual à largura/altura do botãoQuantidade para manter a forma circular
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red', // Fundo vermelho para o botão de remover
            borderWidth: 1,
            borderColor: 'red', // Borda vermelha para combinar com o fundo
            borderRadius: 15, // Torna o botão circular
            marginLeft: 20,
          },
          quantidadeText: {
            fontSize: 16, // Define o tamanho da fonte
            color: '#000', // Define a cor do texto
            fontWeight: 'bold', // Torna o texto em negrito para destaque
            marginLeft: 10, // Espaçamento à esquerda para separar do nome do fio
            marginTop: 5, // Espaçamento no topo para dar um pouco de espaço vertical
        },
        
          
          
    });
    
    
    export default Etapa5Agendamento;
    
    
