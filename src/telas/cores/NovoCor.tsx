import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import { hsvToRgb, rgbToHex } from '../../componentes/utilities/conversorDeCor';
import * as CorService from '../../services/CorService';
import PaletaDeCores from '../../componentes/utilities/PaletaDeCores'




type RouteParams = {
    corId?: string;
}

type HsvColor = {
    h: number;
    s: number;
    v: number;
};

const CORES_PREDEFINIDAS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];


const NovoCor = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const corId = params?.corId;

    const [nome, setNome] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');

    useEffect(() => {
        if (corId) {
            CorService.obterCorPorId(corId)
                .then((cor: any) => {
                    setNome(cor.nome);
                    setSelectedColor(cor.valorHexadecimal);
                })
                .catch(err => console.error("Erro ao buscar cor:", err));
        }
    }, [corId]);
    

    const onColorChange = (color: HsvColor) => {
        const [r, g, b] = hsvToRgb(color.h / 360, color.s, color.v);
        const hexValue = rgbToHex(r, g, b);
        setSelectedColor(hexValue);

    };
    
    const salvar = () => {
        if (!nome || !selectedColor) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
    
        const corData = {
            nome: nome,
            valorHexadecimal: selectedColor,
        };
    
        if (corId) {
            // Atualizar a cor existente
            CorService.atualizarCor(Number(corId), corData)
                .then(response => {
                    Alert.alert('Sucesso', 'Cor atualizada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar cor:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            // Criar uma nova cor
            CorService.criarCor(corData)
                .then(response => {
                    Alert.alert('Sucesso', 'Cor criada com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar cor:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };
    

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {corId ? 'Editar Cor' : 'Nova Cor'}
                    </Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Cor</Text>
                    <Text style={styles.label}>Selecione uma cor</Text>
                <PaletaDeCores onColorSelect={setSelectedColor} />
               </View>

    <TextInput
    value={selectedColor}
    onChangeText={setSelectedColor}
    placeholder="Digite o valor hexadecimal"
    style={styles.input}
/>



                    <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />

                    <View style={styles.buttonContainer}>
                        <AppButton title="Salvar" onPress={salvar} />
                        <AppButton title="Cancelar" onPress={() => navigation.goBack()} />
                    </View>
                    </ScrollView>
        </GlobalLayout>
    );
};

const styles = StyleSheet.create({
    colorPreview: {
        height: 50,
        width: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 10,
    },
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

    paleta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    corPaleta: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    }
});


export default NovoCor;
