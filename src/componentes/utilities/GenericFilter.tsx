import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';

interface FilterItem {
    id: number;
    [key: string]: any; // Isso permite que o objeto tenha quaisquer outras propriedades
}

interface GenericFilterProps {
    items: FilterItem[];
    selectedItems: number[];
    onItemsChange: (items: number[]) => void;
    displayAttribute: string;  // Propriedade que especifica qual atributo do item deve ser usado para exibição
    style?: ViewStyle;
}

const GenericFilter: React.FC<GenericFilterProps> = ({ 
    items, 
    selectedItems, 
    onItemsChange, 
    displayAttribute, 
    style 
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const toggleItem = (itemId: number) => {
        if (selectedItems && selectedItems.includes(itemId)) {
            onItemsChange(selectedItems.filter(id => id !== itemId));
        } else if (selectedItems) {
            onItemsChange([...selectedItems, itemId]);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return isVisible ? (
        <View style={[styles.container, style]}>
            <Icon name="times-circle" size={20} color="black" style={styles.closeIcon} onPress={handleClose} />
            {items.map((item) => (
                <View key={item.id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={selectedItems?.includes(item.id) || false}
                        onValueChange={() => toggleItem(item.id)}
                        tintColors={{ true: 'skyblue', false: 'gray' }}
                    />
                    <Text style={styles.label}>{typeof item[displayAttribute] === 'string' ? item[displayAttribute] : ''}</Text>

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
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#B0B0B0'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: scale(130),
        marginVertical: moderateScale(5),
        marginLeft: moderateScale(5),
        marginRight: moderateScale(20),
    },
    label: {
        margin: moderateScale(8),
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
});

export default GenericFilter;
