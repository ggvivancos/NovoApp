import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../componentes/Botões/AppButton';
import uuid from 'react-native-uuid';

interface OMPEFormulario {
    id: string;
    texto: string;
}

interface FornecedorFormulario {
    id: string;
    texto: string;
}

const Etapa5Agendamento = () => {
    const navigation = useNavigation();
    const [materiaisEspeciais, setMateriaisEspeciais] = useState<string[]>([]);
    const [outrosMateriais, setOutrosMateriais] = useState('');
    const [formulariosOMPE, setFormulariosOMPE] = useState<OMPEFormulario[]>([{ id: String(uuid.v4()), texto: '' }]);
    const [formulariosFornecedor, setFormulariosFornecedor] = useState<FornecedorFormulario[]>([{ id: String(uuid.v4()), texto: '' }]);

    const materiais: string[] = [
        "Intensificador de Imagens", "Raio-X", "Lipoaspirador", 
        "Microscópio", "Torre de Video", "Garrote Pneumático", 
        "Mesa Ortopédica", "Cabeceira Neurocirurgia", "Aparelho de Endoscopia"
    ];

    const selecionarMaterial = (material: string) => {
        if (materiaisEspeciais.includes(material)) {
            setMateriaisEspeciais(materiaisEspeciais.filter(item => item !== material));
        } else {
            setMateriaisEspeciais([...materiaisEspeciais, material]);
        }
    };

    const renderMaterialBox = (material: string) => {
        const isSelected = materiaisEspeciais.includes(material);
        return (
            <TouchableOpacity
                key={material}
                style={[
                    styles.materialOpcao,
                    isSelected && styles.materialOpcaoSelecionada
                ]}
                onPress={() => selecionarMaterial(material)}
            >
                <Text style={[
                    styles.materialTexto,
                    isSelected && styles.materialTextoSelecionado
                ]}>{material}</Text>
            </TouchableOpacity>
        );
    };

    const adicionarOMPE = () => {
        setFormulariosOMPE([...formulariosOMPE, { id: String(uuid.v4()), texto: '' }]);
    };

    
    const removerOMPE = (id: string) => {
        setFormulariosOMPE(formulariosOMPE.filter(formulario => formulario.id !== id));
    };

    const atualizarOMPE = (id: string, texto: string) => {
        setFormulariosOMPE(formulariosOMPE.map(formulario => 
            formulario.id === id ? { ...formulario, texto } : formulario
        ));
    };

    const renderOMPE = (formulario: OMPEFormulario, index: number) => {
        return (
            <View key={formulario.id} style={styles.ompeContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => atualizarOMPE(formulario.id, text)}
                    value={formulario.texto}
                    placeholder="Adicionar um Material"
                />
                {formulariosOMPE.length > 1 && (
                    <TouchableOpacity onPress={() => removerOMPE(formulario.id)} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>-</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const adicionarFornecedor = () => {
        setFormulariosFornecedor([...formulariosFornecedor, { id: String(uuid.v4()), texto: '' }]);
    };

    const removerFornecedor = (id: string) => {
        setFormulariosFornecedor(formulariosFornecedor.filter(formulario => formulario.id !== id));
    };

    const atualizarFornecedor = (id: string, texto: string) => {
        setFormulariosFornecedor(formulariosFornecedor.map(formulario => 
            formulario.id === id ? { ...formulario, texto } : formulario
        ));
    };

    const renderFornecedor = (formulario: FornecedorFormulario, index: number) => {
        return (
            <View key={formulario.id} style={styles.ompeContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => atualizarFornecedor(formulario.id, text)}
                    value={formulario.texto}
                    placeholder="Adicionar um Fornecedor de OPME"
                />
                {formulariosFornecedor.length > 1 && (
                    <TouchableOpacity onPress={() => removerFornecedor(formulario.id)} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>-</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.label}>Recursos Complementares</Text>
                <View style={styles.materiaisOpcoes}>
                    {materiais.map(renderMaterialBox)}
                </View>

                <TextInput
                    style={styles.input}
                    onChangeText={setOutrosMateriais}
                    value={outrosMateriais}
                    placeholder="Outros Recursos"
                />

            <Text style={styles.label}>OMPE</Text>
                 <View style={styles.horizontalContainer}>
                     <TouchableOpacity onPress={adicionarOMPE} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+</Text>
                     </TouchableOpacity>
                     <View style={styles.formulariosContainer}>
                         {formulariosOMPE.map(renderOMPE)}
                     </View>
                  </View>
                

                <Text style={styles.label}>Fornecedor de OPME</Text>
            <View style={styles.horizontalContainer}>
                <TouchableOpacity onPress={adicionarFornecedor} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <View style={styles.formulariosContainer}>
                    {formulariosFornecedor.map(renderFornecedor)}
                </View>
            </View>
                

                <View style={styles.buttonContainer}>
                    <AppButton title="Salvar" onPress={() => {}} />
                    <AppButton title="Cancelar" onPress={() => navigation.goBack()} />
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
        color: '#333'
    },
    materiaisOpcoes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    materialOpcao: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
        width: '31%', // Para três colunas
    },
    materialOpcaoSelecionada: {
        backgroundColor: 'black',
    },
    materialTexto: {
        textAlign: 'center',
        color: 'black',
    },
    materialTextoSelecionado: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10
    },
    ompeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        width: '100%',
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
    },
    removeButton: {
        width: 20,
        height: 20,
        borderRadius: 15,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removeButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Centraliza verticalmente os itens dentro do contêiner


    },
    formulariosContainer: {
        flex: 1,
        marginLeft: 10, // Ajuste conforme necessário
    },
});

export default Etapa5Agendamento;

