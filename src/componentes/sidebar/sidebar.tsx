import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
   

interface SidebarProps {
    onItemSelect?: (itemId: number) => void;  // Callback for item selection

    position?: 'left' | 'right';
    onClose?: () => void;  // Uma propriedade de callback para fechar a sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ position = 'left', onClose, onItemSelect }) => {
    return (
        <View style={styles.sidebar}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Text style={styles.closeButton}>×</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Procedimentos</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Anestesistas</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Cirurgias</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Cirurgiões</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Grupos de Anestesia</Text>
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Hospitais</Text>
            </TouchableWithoutFeedback>

                        
            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Salas de Cirurgia</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onItemSelect && onItemSelect(1)}>
                <Text style={styles.sidebarItem}>Setores</Text>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        width: 250,
        height: "100%",
        backgroundColor: '#f7f7f7',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        zIndex: 10
    },
    closeButton: {
        padding: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    sidebarItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    }
});

export default Sidebar;
