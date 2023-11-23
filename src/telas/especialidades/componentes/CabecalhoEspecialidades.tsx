import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles/themes';  // Importar cores do themes.js
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

interface Props {
    style?: object;
}

const CabecalhoEspecialidades: React.FC<Props> = ({ style }) => {
    return (
        <View style={[styles.header, style]}>
            <Text style={styles.headerTitle}>Especialidades</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        borderRadius: moderateScale(10),
        backgroundColor: colors.primary,
        width: '100%'
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        textAlign: 'center',
        marginRight: moderateScale(50),
    },
    iconContainer: {
        width: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIconContainer: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: verticalScale(1),
        },
        shadowOpacity: 0.22,
        shadowRadius: moderateScale(2.22),
        elevation: 3,
    },
});

export default CabecalhoEspecialidades;
