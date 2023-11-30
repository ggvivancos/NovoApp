import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles/themes';  // Importar cores do themes.js
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

interface Props {
    style?: object;
}

const CabecalhoStatus: React.FC<Props> = ({ style }) => {
    return (
        <View style={[styles.header, style]}>
            <Text style={styles.headerTitle}>Status</Text>
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
        marginRight: moderateScale(0),
    },
    // Restante do estilo, se necessário
});

export default CabecalhoStatus;
