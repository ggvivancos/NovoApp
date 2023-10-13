import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';

type GrupoDeAnestesia = {
    id: number;
    nome: string;
};

interface GrupoAnestesiaModalProps {
    isModalVisible: boolean;
    onDismiss: () => void;
    onGrupoSelected: (grupoId: number) => void;
    grupos: GrupoDeAnestesia[];
}

const GrupoAnestesiaModal: React.FC<GrupoAnestesiaModalProps> = ({ isModalVisible, onDismiss, onGrupoSelected, grupos }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={onDismiss}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                    {grupos.map(grupo => (
                        <TouchableOpacity 
                            key={grupo.id} 
                            onPress={() => {
                                onGrupoSelected(grupo.id);
                            }}
                        >
                            <Text style={{ padding: 10 }}>{grupo.nome}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Fundo semi-transparente
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%',  // Limitando a altura máxima do modal
    },
    itemContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    itemText: {
        fontSize: 16
    }
});

export default ItemPickerModal

export default GrupoAnestesiaModal;
