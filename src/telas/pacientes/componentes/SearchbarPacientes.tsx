import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

interface SearchbarPacientesProps {
    onSearch?: (searchText: string) => void;
    onSearchChange?: (text: string) => void;
    onSearchSubmit?: () => void;
    style?: ViewStyle;
    placeholder?: string;
}

const SearchbarPacientes: React.FC<SearchbarPacientesProps> = ({ 
    onSearch, 
    onSearchChange, 
    onSearchSubmit, 
    style, 
    placeholder = "Pesquisar paciente..." 
}) => {
    const [searchText, setSearchText] = useState<string>('');

    return (
        <View style={[styles.container, style]}>
            <Icon name="search" size={moderateScale(20)} color="#000" style={styles.searchIcon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    if(onSearchChange) {
                        onSearchChange(text);
                    }
                }}
            />
            <Icon
                name="arrow-right"
                size={moderateScale(15)}
                color="#000"
                style={styles.iconStyle}
                onPress={() => {
                    if (onSearch) {
                        onSearch(searchText);
                    }
                    if (onSearchSubmit) {
                        onSearchSubmit();
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: verticalScale(0),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: moderateScale(10),
        padding: 0,
        marginBottom: verticalScale(0),
        flex: 1,
        height: verticalScale(40)
    },
    searchIcon: {
        marginLeft: moderateScale(15),
    },
    input: {
        flex: 0.85,
        marginRight: moderateScale(100),
        marginLeft: 0
    },
    iconStyle: {
        marginRight: moderateScale(10),
    },
});

export default SearchbarPacientes;
