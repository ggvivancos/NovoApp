import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';



interface Props {
    style?: object;
}

const CabeçalhoAnestesistas: React.FC<Props> = ({ style }) => {
    return (
        <View style={[styles.header, style]}>
        <Text style={styles.headerTitle}>Anestesistas</Text>
        
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        borderRadius: 10,
        backgroundColor: 'skyblue',
        width: '100%'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white', 
        flex: 1,
        textAlign: 'center',
        marginRight: 50,
    },
    iconContainer: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
