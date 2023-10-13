import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, Text, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';


interface GrupoDeAnestesia {
    id: number;
    nome: string;
    nomeabreviado: string;
    createdAt: string;
    updatedAt: string;
}

interface FiltroGrupoDeAnestesiaProps {
    grupos: GrupoDeAnestesia[];
    selectedGrupos: number[];
    onGruposChange: (grupos: number[]) => void;
    style?: ViewStyle;
}

const FiltroGrupoDeAnestesia: React.FC<FiltroGrupoDeAnestesiaProps> = ({ grupos, selectedGrupos, onGruposChange, style }) => {
    console.log('selectedGrupos:', selectedGrupos);

    const [isVisible, setIsVisible] = useState(true);

    const toggleGrupo = (grupoId: number) => {
        console.log("Tentando alternar o grupo:", grupoId);
        if (selectedGrupos && selectedGrupos.includes(grupoId)) {
            console.log("Desmarcando o grupo:", grupoId);
            onGruposChange(selectedGrupos.filter(id => id !== grupoId));
        } else if (selectedGrupos) {
            console.log("Marcando o grupo:", grupoId);
            onGruposChange([...selectedGrupos, grupoId]);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };


    
    return isVisible ? (
        <View style={[styles.container, style]}>
            <Icon name="times-circle" size={20} color="black" style={styles.closeIcon} onPress={handleClose} />
            {grupos.map((grupo) => (
                <View key={grupo.id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={selectedGrupos?.includes(grupo.id) || false}
                        onValueChange={() => toggleGrupo(grupo.id)}
                        tintColors={{ true: 'skyblue', false: 'gray' }}
                    />
                    <Text style={styles.label}>{grupo.nomeabreviado}</Text>
                </View>
            ))}
        </View>
    ) : null;
    
};

const styles = StyleSheet.create({
    container: {
        marginVertical: verticalScale(5),
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#E0E0E0',
        borderRadius: 15,        // Adiciona bordas arredondadas
        borderWidth: 1,        // Adiciona uma borda fina
        borderColor: '#B0B0B0' // Define a cor da borda
    },

        firstCheckbox: {
             marginTop: moderateScale(5),
},
        lastCheckbox: {
           marginBottom: moderateScale(5),
},
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: scale(130), // Reduzir a largura para evitar sobreposição
        marginVertical: moderateScale(5),
        marginLeft: moderateScale(5),
        marginRight: moderateScale(20),
    },
    label: {
        margin: moderateScale(8),
    },
    closeIcon: {
        position: 'absolute',
        top: 10,  // Ajuste conforme necessário
        right: 10,  // Ajuste conforme necessário
    },
});

export default FiltroGrupoDeAnestesia;
