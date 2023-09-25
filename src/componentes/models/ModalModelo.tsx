import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';

interface Item {
    id: number;
    label: string;
}

interface ModalModeloProps {
    isVisible: boolean;
    onDismiss: () => void;
    onItemSelected: (itemId: number) => void;
    items: Item[];
    title?: string;
}

const ModalModelo: React.FC<ModalModeloProps> = ({ isVisible, onDismiss, onItemSelected, items, title = "Selecione um item" }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        setFilteredItems(
            items.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [searchText, items]);

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

                    {/* Caixa de texto para pesquisa */}
                    <TextInput
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Pesquisar..."
                    />

                    <View style={styles.modalContent}>
                        {filteredItems.map(item => (
                            <TouchableOpacity 
                                key={item.id} 
                                onPress={() => {
                                    onItemSelected(item.id);
                                }}
                                style={styles.modalItem}
                            >
                                <Text style={styles.modalItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={onDismiss}>
                        <Text style={styles.modalCloseButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
        color: 'black'
    },
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
        fontSize: 15,
        marginBottom: 15,
        fontWeight: 'bold'
    },
    modalContent: {
        maxHeight: 300
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 0,
        borderBottomColor: '#eee',
        width: '100%'
    },
    modalItemText: {
        color: 'black',
        fontSize: 14
    },
    modalCloseButton: {
        backgroundColor: '#89D5B8',
        borderRadius: 25,
        height: 40,
        width: 120,
        margin: 10,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold'
    },
    searchInput: {
        
        borderColor: '#333',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        width: '100%'
    }
});

export default ModalModelo;
