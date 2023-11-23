import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobalLayout from '../../layouts/GlobalLayout';
import AppButton from '../../componentes/Botões/AppButton';
import * as SetorService from '../../services/SetorService';
import * as HospitalService from '../../services/HospitalService';


type RouteParams = {
    setorId?: string;
    hospitalId?: string;
}

const NovoSetor = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as RouteParams;
    const setorId = params?.setorId;
    const { hospitalId } = route.params as RouteParams;
    const [nome, setNome] = useState('');
    const [nomeAbreviado, setNomeAbreviado] = useState('');
    const [nomeDoHospital, setNomeDoHospital] = useState<string | null>(null);


    useEffect(() => {
        const fetchNomeDoHospital = async () => {
            if (hospitalId) {  // Verifique se hospitalId é definido antes de fazer a chamada
                try {
                    const hospital = await HospitalService.obterHospitalPorId(hospitalId);
                    if (hospital && hospital.nomeHospital) {
                        setNomeDoHospital(hospital.nomeHospital);
                    } else {
                        console.error("Nome do hospital não encontrado ou inválido:", hospital);
                    }
                } catch (error) {
                    console.error("Erro ao buscar nome do hospital:", error);
                }
            }
        };
    
        fetchNomeDoHospital();
    }, [hospitalId]);
    
    

    useEffect(() => {
        if (setorId) {
            SetorService.obterSetorPorId(setorId)
                .then((setor: any) => {
                    setNome(setor.nome);
                    setNomeAbreviado(setor.nomeabreviado);
                })
                .catch(err => console.error("Erro ao buscar setor:", err));
        }
    }, [setorId]);

    const salvar = () => {
        if (!nome) {
            Alert.alert('Erro', 'Por favor, preencha o nome.');
            return;
        }

        const setorData = {
            nome: nome,
            nomeabreviado: nomeAbreviado,
            hospitalId: hospitalId  // Adicione esta linha
        };

        if (setorId) {
            SetorService.atualizarSetor(Number(setorId), setorData)
                .then(response => {
                    Alert.alert('Sucesso', 'Setor atualizado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao atualizar setor:', error);
                    Alert.alert('Erro', 'Erro ao atualizar. Tente novamente.');
                });
        } else {
            SetorService.criarSetor(setorData)
                .then(response => {
                    Alert.alert('Sucesso', 'Setor criado com sucesso!');
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Erro ao criar setor:', error);
                    Alert.alert('Erro', 'Erro ao criar. Tente novamente.');
                });
        }
    };

    return (
        <GlobalLayout showBackButton={true}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                <Text style={styles.title}>
                    {setorId ? 'Editar Setor' : 'Novo Setor'}
                </Text>
                {nomeDoHospital && (
                    <Text style={styles.hospitalName}>
                        Hospital: {nomeDoHospital}
                    </Text>
                )}

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Nome Abreviado</Text>
                    <TextInput
                        value={nomeAbreviado}
                        onChangeText={setNomeAbreviado}
                        placeholder="Digite o nome abreviado (opcional)"
                        style={styles.input}
                    />

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
    hospitalName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
    },
    
});

export default NovoSetor;
