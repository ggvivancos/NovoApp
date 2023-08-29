// ComponenteCabecalho.tsx

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';


 


const ComponenteCabecalho: React.FC = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>Escala de Plantão</Text>
            <TouchableOpacity style={styles.addButton}>
                <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(15),
        paddingVertical: scale(15),
        backgroundColor: '#1E66AB',
        borderBottomLeftRadius: moderateScale(15),
        borderBottomRightRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        borderTopLeftRadius: moderateScale(15),
    },
    headerText: {
        fontSize: moderateScale(20),
        color: 'white',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#3D8BF9',
        borderRadius: 50,
        width: moderateScale(30),
        height: moderateScale(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ComponenteCabecalho;


