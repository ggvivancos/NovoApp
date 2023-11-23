import React, { useState, useEffect, ReactNode } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SetorService from '../../services/SetorService';
import AcoesBotoes from '../../componentes/Botões/AcoesBotoes';
import GlobalLayout from '../../layouts/GlobalLayout';
import SearchbarSetoresESalas from './componentes/SearchbarSetoresESalas';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabecalhoSetoresESalas from './componentes/CabecalhoSetoresESalas';
import * as HospitalService from '../../services/HospitalService'; // supondo que você tenha um serviço para hospitais
import * as SalaDeCirurgiaService from '../../services/SalaDeCirurgiaService';
import AcoesBotoesPretos from '../../componentes/Botões/AcoesBotoesPretos';



type Sala = {
    
    id: number;
    nome: string;
    nomeabreviado: string;
    hospitalId?: string;  // Adicionando hospitalId (opcional)
    setorId?: string;     // Adicionando setorId (opcional)
    
};

type Setor = {
    id: number;
    nome: string;
    nomeabreviado: string;
    salas: Sala[];
    
};



type RouteParams = {
    hospitalId: string;
};

const IndexSetorESala = () => {
    const [setores, setSetores] = useState<Setor[]>([]);
    const navigation = useNavigation();
    const route = useRoute();
    const [filteredData, setFilteredData] = useState<Setor[]>([]);
    const { hospitalId } = route.params as RouteParams;
    const [nomeHospital, setNomeHospital] = useState<string | null>(null);
    const [expandedSetorId, setExpandedSetorId] = useState<number | null>(null);
    const [salas, setSalas] = useState<Sala[]>([]);



    const fetchNomeHospital = async () => {
        try {
            const data = await HospitalService.obterHospitalPorId(hospitalId);
            if (data && data.nomeHospital) {
                setNomeHospital(data.nomeHospital);
            } else {
                console.error("Nome do hospital não encontrado ou inválido:", data);
            }
        } catch (error) {
            console.error("Erro ao buscar nome do hospital:", error);
        }
    };
    
    useEffect(() => {
        fetchNomeHospital();
    }, [hospitalId]);
    

    
    const fetchSetores = async () => {
        try {
            const setoresResponse = await SetorService.obterSetoresPorHospital(hospitalId);
            if (setoresResponse && Array.isArray(setoresResponse)) {
                setSetores(setoresResponse);
            } else {
                console.error("A resposta da API não é um array ou está indefinida:", setoresResponse);
            } 
        } catch (error) {
            console.error('Erro ao buscar setores:', error);
        }
    };
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchNomeHospital();
            fetchSetores();
        });
    
        return unsubscribe;
    }, [navigation, fetchNomeHospital, fetchSetores]);
       

    const handleDeletarSetor = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este setor?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarSetorConfirmado(id) }
            ]
        );
    };
    
    const deletarSetorConfirmado = async (id: number) => {
        try {
            const response = await SetorService.deletarSetor(id);
            if (response.ok) {
                const novosSetores = setores.filter(setor => setor.id !== id);
                setSetores(novosSetores);
                Alert.alert("Sucesso", "Setor excluído com sucesso.");
            } else {
                throw new Error("Falha ao excluir o setor.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar o setor:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir o setor.");
        }
    };

    const handleSearchChange = (text: string) => {
        const newData = setores.filter(item => {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
    };

    const handleSetorClick = async (setorId: number) => {
        if (expandedSetorId === setorId) {
            setExpandedSetorId(null);
        } else {
            try {
                const salas = await SalaDeCirurgiaService.obterSalasDeCirurgiaPorSetor(setorId.toString());
                const setorIndex = setores.findIndex(setor => setor.id === setorId);
                const updatedSetores = [...setores];
                updatedSetores[setorIndex].salas = salas;
                setSetores(updatedSetores);
                setExpandedSetorId(setorId);
            } catch (error) {
                console.error("Error fetching salas de cirurgia for setor:", error);
            }
        }
    };
    
    const handleDeletarSala = (id: number) => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir esta sala de cirurgia?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => deletarSalaConfirmado(id) }
            ]
        );
    };
    
    const deletarSalaConfirmado = async (id: number) => {
        try {
            const response = await SalaDeCirurgiaService.deletarSalaDeCirurgia(id);
            if (response.ok) {
                const updatedSetores = setores.map(setor => {
                    if (setor.id === expandedSetorId) {
                        return {
                            ...setor,
                            salas: setor.salas.filter(sala => sala.id !== id)
                        };
                    }
                    return setor;
                });
                setSetores(updatedSetores);
                Alert.alert("Sucesso", "Sala de Cirurgia excluída com sucesso.");
            } else {
                throw new Error("Falha ao excluir a sala de cirurgia.");
            }
        } catch (erro) {
            console.error("Ocorreu um erro ao deletar a sala de cirurgia:", erro);
            Alert.alert("Erro", "Houve um erro ao excluir a sala de cirurgia.");
        }
    };
    
    
    

    return (
        <GlobalLayout showBackButton={true} headerComponent={<CabecalhoSetoresESalas style={styles.cabecalhoPadding} />}>
            <ScrollView style={styles.container}>
                {nomeHospital && <Text style={styles.hospitalName}>{nomeHospital}</Text>}
                <View style={styles.searchAndIconContainer}>
                    <SearchbarSetoresESalas
                        placeholder="Pesquisar setor ou sala..."
                        onSearchChange={handleSearchChange}
                    />
                    <Icon 
                        name="plus" 
                        size={24} 
                        color="#000"
                        style={styles.iconStyle}
                        onPress={() => (navigation as any).navigate('NovoSetor', { hospitalId: hospitalId })}
                />
                </View>
                
                <View style={styles.tableHeader}>
                    <View style={styles.cellNomeCompleto}><Text style={styles.headerText}>Setor</Text></View>
                    <View style={styles.cellNomeAbreviado}><Text style={styles.headerText}>Abreviação</Text></View>
                    <View style={styles.cellAcoes}><Text style={styles.headerText}>Ações</Text></View>
                </View>
        
                {setores.map(setor => (
    <View key={setor.id}>
        <TouchableOpacity 
            style={styles.row} 
            onPress={() => {
                console.log("Clicando no setor com ID:", setor.id);
                handleSetorClick(setor.id);
            }}
        >
            <View style={styles.cellNomeCompleto}><Text>{setor.nome}</Text></View>
            <View style={styles.cellNomeAbreviado}><Text>{setor.nomeabreviado}</Text></View>
            <AcoesBotoes
                onEditarPress={() => (navigation as any).navigate('NovoSetor', { setorId: setor.id })}
                onDeletarPress={() => handleDeletarSetor(setor.id)}
            />
        </TouchableOpacity>

        {setor.id === expandedSetorId && setor.salas && (
            <>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => (navigation as any).navigate('NovoSalaDeCirurgia', { setorId: setor.id })}
                >
                    <Icon 
                        name="plus-circle" 
                        size={24} 
                        color="#fff"
                        style={styles.addIconStyle}
                    />
                    <Text style={styles.addButtonText}>Nova Sala de Cirurgia</Text>
                </TouchableOpacity>

                {setor.salas.map(sala => (
                    <View key={sala.id} style={{...styles.salaRow, flexDirection: 'row'}}>
                    <View style={styles.cellNomeCompleto}><Text>{sala.nome}</Text></View>
                    <View style={styles.cellNomeAbreviado}>
                        {sala.nomeabreviado ? <Text>{sala.nomeabreviado}</Text> : null}
                    </View>
                    <AcoesBotoesPretos
                        onEditarPress={() => (navigation as any).navigate('NovoSalaDeCirurgia', { salaId: sala.id })}
                        onDeletarPress={() => handleDeletarSala(sala.id)}
                    />
                    </View>
                ))}
            </>
        )}
    </View>
))}
            </ScrollView>
        </GlobalLayout>
    );
    
    


    
};


const styles = StyleSheet.create({
    setorItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cellNomeCompleto: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    cellNomeAbreviado: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    cellAcoes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        backgroundColor: '#f7f7f7',
        paddingLeft: 10,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        paddingLeft: 20,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',  // ou qualquer outra cor de fundo desejada
    },
    cabecalhoPadding: {
        paddingLeft: 50,
    },
    searchAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    iconStyle: {
        marginLeft: 20,
    },
    hospitalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center'
    },

    salaRow: {
        backgroundColor: '#e8e8e8',
        paddingLeft: 80,
        alignItems: 'center',
        marginVertical: 3, // Isso adiciona 10 unidades de espaço acima e abaixo do item
        paddingVertical: 3, // Isso adiciona 5 unidades de espaço dentro do ite
    },

    tableHeaderSala: {
        flexDirection: 'row',
        borderBottomWidth: 0.2,
        borderBottomColor: '#ddd',
        paddingVertical: 1,
        paddingLeft: 30, // Manter alinhado com as linhas das salas
        backgroundColor: '#g7g7g7',
        fontSize: 10,
},

addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Cor de fundo preta
    padding: 10,
    borderRadius: 20, // Isso cria um botão circular
    marginVertical: 10, // Espaçamento vertical
    alignSelf: 'center', // Centraliza o botão
},

addIconStyle: {
    marginRight: 5, // Espaço entre o ícone e o texto
},

addButtonText: {
    color: '#fff', // Texto branco
    fontWeight: 'bold',
},


    
    
});

export default IndexSetorESala;



