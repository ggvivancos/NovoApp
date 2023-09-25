import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navegação/NavigationTypes';
import AnimatedButton from '../utilities/AnimatedButton'; 

interface SidebarProps {
    onItemSelect?: (itemId: number) => void;
    position?: 'left' | 'right';
    onClose?: () => void;
}

const SidebarItem: React.FC<{ title: string; onPress: () => void; isSubMenu?: boolean }> = ({ title, onPress, isSubMenu = false }) => (
    <AnimatedButton onPress={onPress}>
        <Text style={[styles.sidebarItem, isSubMenu && styles.subMenuItem]}>{title}</Text>
    </AnimatedButton>
);


const SubMenu: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View>
            <TouchableWithoutFeedback onPress={(event) => {
                setIsOpen(!isOpen);
                event.stopPropagation();  // Adicione esta linha
            }}>
                <Text style={styles.sidebarItem}>{title}</Text>
            </TouchableWithoutFeedback>
            {isOpen && (
                <View style={styles.subMenuItem}>
                    {children}
                </View>
            )}
        </View>
    );
};



const Sidebar: React.FC<SidebarProps> = ({ position = 'left', onClose = () => {}, onItemSelect }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    return (
        <View style={styles.sidebar}>
            <AnimatedButton onPress={onClose}>
                <Text style={styles.closeButton}>×</Text>
            </AnimatedButton>

            <SidebarItem title="ESCALA DIÁRIA" onPress={() => { }} />
            <SidebarItem title="AGENDA DE PROCEDIMENTOS" onPress={() => { }} />

            <SubMenu title="BANCO DE DADOS">
            <SidebarItem title="Anestesistas" onPress={() => {
    console.log("Clicado em Anestesistas");
    navigation.navigate('IndexAnestesista');
    onClose && onClose();
}} />

                <SidebarItem title="Cirurgias" onPress={() => { }} />
                <SidebarItem title="Cirurgiões" onPress={() => { }} />
                <SidebarItem title="Grupos de Anestesia" onPress={() => { }} />
                <SidebarItem title="Hospitais" onPress={() => { }} />
                <SidebarItem title="Salas de Cirurgia" onPress={() => { }} />
                <SidebarItem title="Setores" onPress={() => { }} />
                <SidebarItem title="Procedimentos" onPress={() => { }} />
            </SubMenu>

            <SidebarItem title="ESTATÍSTICAS" onPress={() => { }} />
            <SidebarItem title="CONFIGURAÇÕES" onPress={() => { }} />
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        width: 200,
        height: "100%",
        backgroundColor: 'rgba(135, 206, 235, 1)', 
        borderRightWidth: 0,
        borderRightColor: '#ddd',
        zIndex: 10
    },
    closeButton: {
        padding: 15,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        color: 'white'
    },
    sidebarItem: {
        padding: 15,
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
        color: 'white',
        fontWeight: 'bold',
    },
    subMenuItem: {
        paddingLeft: 30
    },
    menuTitle: {
        textTransform: 'uppercase'
    },
    subMenuContainer: {
        paddingBottom: 0
    }
});

export default Sidebar;
