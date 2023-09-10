import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CabeçalhoGlobal from '../../../componentes/CabeçalhoGlobal';


interface Props {
    style?: object;
}

const CabeçalhoAnestesistas: React.FC<Props> = ({ style }) => {
    return (
        <View style={[styles.header, style]}>
            <TouchableOpacity>
                <Icon name="arrow-left" size={20} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>ANESTESISTAS</Text>
            
            <TouchableOpacity style={styles.addIconContainer}>
                <Icon name="plus" size={24} color="skyblue" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'skyblue',
        width: '100%'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white', 
        flex: 1,
        textAlign: 'center',
        marginLeft: 20  // Adicionado para compensar o espaço do ícone do menu
    },
    menuIconContainer: {
        position: 'absolute',
        left: 50,  // Posiciona o ícone do menu ao lado da seta
    },
    addIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
});

export default CabeçalhoAnestesistas;
