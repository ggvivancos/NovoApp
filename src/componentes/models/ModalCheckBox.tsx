import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, TextInput, ScrollView } from 'react-native';

interface Item {
    id: number;
    label: string;
}

interface ModalCheckBoxProps {
    isVisible: boolean;
    onDismiss: () => void;
    onItemSelected: (itemId: number) => void;
    items: Item[];
    selectedItems: number[];
    title?: string;
}

const ModalCheckBox: React.FC<ModalCheckBoxProps> = ({ isVisible, onDismiss, onItemSelected, items, selectedItems, title = "Selecione um item" }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        setFilteredItems(
            items.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [searchText, items]);

    const isItemSelected = (id: number) => {
        return selectedItems.includes(id);
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
                        placeholder="Pesquisar..."
                    />
                    <View style={styles.scrollViewContainer}>
                        <ScrollView>
                            {filteredItems.map((item) => (
                                <TouchableOpacity 
                                    key={item.id.toString()} 
                                    onPress={() => onItemSelected(item.id)}
                                    style={styles.itemContainer}
                                >
                                    <View style={isItemSelected(item.id) ? styles.checkboxChecked : styles.checkboxUnchecked} />
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={onDismiss}>
                        <Text style={styles.modalCloseButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    searchInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        width: '100%',
    },
    flatList: {
        maxHeight: 300,
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    checkboxUnchecked: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: 10,
    },
    checkboxChecked: {
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: '#000',
        marginRight: 10,
    },
    itemText: {
        fontSize: 16,
        color: 'black',
    },
    modalCloseButton: {
        backgroundColor: '#89D5B8',
        borderRadius: 25,
        height: 40,
        width: 120,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    scrollViewContainer: {
        maxHeight: 300, // Ajuste esta altura conforme necessário
        width: '100%',
    },
});

export default ModalCheckBox;
