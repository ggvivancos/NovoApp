import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles/themes';  // Importar cores do themes.js
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

interface Props {
    style?: object;
}

const CabecalhoPacientes: React.FC<Props> = ({ style }) => {
    return (
        <View style={[styles.header, style]}>
            <Text style={styles.headerTitle}>Pacientes</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        borderRadius: moderateScale(10),
        backgroundColor: colors.primary,  // Pode ajustar a cor se necessário
        width: '100%'
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.text,  // Pode ajustar a cor do texto se necessário
        flex: 1,
        textAlign: 'center',
        marginRight: moderateScale(50),
    },
    // Outros estilos, se necessário
});

export default CabecalhoPacientes;
