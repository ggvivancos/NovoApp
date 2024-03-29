import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles/themes';  // Importar cores do themes.js
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

interface Props {
    style?: object;
}

const CabecalhoAgendamentos: React.FC<Props> = ({ style }) => {
    return (
        <View style={[styles.header, style]}>
            <Text style={styles.headerTitle}>Agendamentos</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        backgroundColor: colors.primary,  // Ajuste a cor se necessário
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.text,  // Ajuste a cor do texto se necessário
        flex: 1,
        textAlign: 'center',
        marginRight: moderateScale(50),
    },
    // Adicione outros estilos, se necessário
});

export default CabecalhoAgendamentos;
