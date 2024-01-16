import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import ModalCheckBox from '../../componentes/models/ModalCheckBox';
import * as OPMEService from '../../services/OPMEService';
import * as FornecedorService from '../../services/FornecedorService';
import { useAgendamento } from '../../context/AgendamentoContext';
import * as RecursoComplementarService from '../../services/RecursoComplementarService';



interface Etapa5Props {
    irParaProximaEtapa: () => void;
    irParaEtapaAnterior: () => void;
}

interface Opme {
    id: number;
    nome: string;
}

interface Fornecedor {
    id: number;
    nome: string;
}

const Etapa5Agendamento: React.FC<Etapa5Props> = ({ irParaProximaEtapa, irParaEtapaAnterior }) => {
    const navigation = useNavigation();
    const [materiaisEspeciais, setMateriaisEspeciais] = useState<number[]>([]);
    const [opmes, setOpmes] = useState<Opme[]>([]);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [opmesSelecionadas, setOpmesSelecionadas] = useState<Opme[]>([]);
    const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<Fornecedor[]>([]);
    const [mostrarModalOpme, setMostrarModalOpme] = useState(false);
    const [mostrarModalFornecedor, setMostrarModalFornecedor] = useState(false);
    const { dadosEtapa1, dadosEtapa2, dadosEtapa3, dadosEtapa4, dadosEtapa5, salvarDadosEtapa5 } = useAgendamento();
    const [recursosComplementares, setRecursosComplementares] = useState([]);
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
        OPMEService.obterOPMEs().then(response => {
            setOpmes(response.data);
        });
        FornecedorService.obterFornecedores().then(response => {
            setFornecedores(response.data);
        });
        RecursoComplementarService.obterRecursosComplementares().then(response => {
            setRecursosComplementares(response.data);
        });
    }, []);

    useEffect(() => {
        if (dadosEtapa5) {
            setMateriaisEspeciais(dadosEtapa5.materiaisEspeciais);
            
    
            const opmesSelecionadasAtualizadas = dadosEtapa5.opmesSelecionadas
                .map(opmeId => opmes.find(opme => opme.id === opmeId))
                .filter(opme => opme != null); // Filtra os itens não nulos e não undefined
            setOpmesSelecionadas(opmesSelecionadasAtualizadas as Opme[]); // Cast para o tipo correto
    
            const fornecedoresSelecionadosAtualizados = dadosEtapa5.fornecedoresSelecionados
                .map(fornecedorId => fornecedores.find(fornecedor => fornecedor.id === fornecedorId))
                .filter(fornecedor => fornecedor != null); // Filtra os itens não nulos e não undefined
            setFornecedoresSelecionados(fornecedoresSelecionadosAtualizados as Fornecedor[]); // Cast para o tipo correto
        }
    }, [dadosEtapa5, opmes, fornecedores]);
    
    

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

    const renderOpmeBox = (opme: Opme) => (
        <View key={opme.id} style={styles.itemBox}>
            <Text style={styles.itemBoxText}>{opme.nome}</Text>
            <TouchableOpacity onPress={() => selecionarOpme(opme.id)} style={styles.itemBoxRemove}>
                <Text style={styles.itemBoxRemoveText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFornecedorBox = (fornecedor: Fornecedor) => (
        <View key={fornecedor.id} style={styles.itemBox}>
            <Text style={styles.itemBoxText}>{fornecedor.nome}</Text>
            <TouchableOpacity onPress={() => selecionarFornecedor(fornecedor.id)} style={styles.itemBoxRemove}>
                <Text style={styles.itemBoxRemoveText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    const salvarEtapa5 = () => {
        const dadosEtapa5 = {
            materiaisEspeciais,
            opmesSelecionadas: opmesSelecionadas.map(opme => opme.id),
            fornecedoresSelecionados: fornecedoresSelecionados.map(fornecedor => fornecedor.id),
            
        };

        salvarDadosEtapa5(dadosEtapa5);
    irParaProximaEtapa();
};

        // Continuação do código...

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
        
                    {renderizarOpmeModal()}
                    {renderizarFornecedorModal()}
        
                    <View style={styles.buttonContainer}>
                        <AppButton title="Etapa Anterior" onPress={irParaEtapaAnterior} />
                        <AppButton title="Cancelar" onPress={cancelarAgendamento} style={styles.cancelButton} />
                        <AppButton title="Próxima Etapa" onPress={salvarEtapa5} />
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
        
    });
    
    
    export default Etapa5Agendamento;
    
    
