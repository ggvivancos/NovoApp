import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface SearchbarStatusProps {
    onSearch?: (searchText: string) => void;
    onSearchChange?: (text: string) => void;
    onSearchSubmit?: () => void;
    style?: ViewStyle;
}

const SearchbarStatus: React.FC<SearchbarStatusProps> = ({ onSearch, onSearchChange, onSearchSubmit, style }) => {
    const [searchText, setSearchText] = useState<string>('');

    return (
        <View style={[styles.container, style]}>
            <Icon name="search" size={moderateScale(20)} color="#000" style={styles.searchIcon} />
            <TextInput
                style={styles.input}
                placeholder="Pesquisar status..."
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    if(onSearchChange) {
                        onSearchChange(text);
                    }
                }}
                onSubmitEditing={() => {
                    if (onSearch) {
                        onSearch(searchText);
                    }
                    if (onSearchSubmit) {
                        onSearchSubmit();
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
        marginVertical: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: moderateScale(10),
        padding: 0,
        marginBottom: 0,
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

export default SearchbarStatus;
