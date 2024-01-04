import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Paciente } from '../../types/types';

interface ModalPacienteProps {
    isVisible: boolean;
    onDismiss: () => void;
    onPacienteSelected: (paciente: Paciente) => void;
    onPacienteCreated: (nome: string) => void;
    pacientes: Paciente[];
    title?: string;
}

const ModalPaciente: React.FC<ModalPacienteProps> = ({
    isVisible, onDismiss, onPacienteSelected, onPacienteCreated, pacientes, title = "Selecione um paciente"
}) => {
    const [searchText, setSearchText] = useState('');
    const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);

    useEffect(() => {
        setFilteredPacientes(
            pacientes.filter(paciente => paciente.nomecompleto.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [searchText, pacientes]);

    const handleCreateNewPaciente = () => {
        onPacienteCreated(searchText);
        onDismiss();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onDismiss}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    <TextInput
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Pesquisar paciente..."
                    />

                    <View style={styles.scrollViewContainer}>
                        <ScrollView>
                            {filteredPacientes.map((item) => (
                                <TouchableOpacity 
                                    key={item.id.toString()} 
                                    onPress={() => onPacienteSelected(item)}
                                    style={styles.modalItem}
                                >
                                    <Text style={styles.modalItemText}>{item.nomecompleto}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {searchText && !filteredPacientes.length && (
                        <TouchableOpacity onPress={handleCreateNewPaciente} style={styles.createNewButton}>
                            <Text style={styles.createNewText}>Criar novo paciente: {searchText}</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.modalCloseButton} onPress={onDismiss}>
                        <Text style={styles.modalCloseButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold'
    },
    searchInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        width: '100%'
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%'
    },
    modalItemText: {
        color: 'black',
        fontSize: 16
    },
    createNewButton: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#e7e7e7',
        borderRadius: 10
    },
    createNewText: {
        color: '#007bff',
        fontSize: 16
    },
    modalCloseButton: {
        backgroundColor: '#89D5B8',
        borderRadius: 25,
        height: 40,
        width: 120,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold'
    },

    scrollViewContainer: {
        maxHeight: 300, // Ajuste esta altura conforme necessário
        width: '100%',
    },
});

export default ModalPaciente;
