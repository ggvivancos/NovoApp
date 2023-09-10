import React from 'react';
import { View, StyleSheet } from 'react-native';
import CabeçalhoGlobal from '../componentes/CabeçalhoGlobal'; 


interface GlobalLayoutProps {
    headerComponent?: React.ReactNode;
    children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ headerComponent, children }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {headerComponent}
            </View>
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'skyblue', // ou qualquer outra cor que você queira para o fundo
    },
    contentContainer: {
        flex: 1,
    },
});

export default GlobalLayout;
