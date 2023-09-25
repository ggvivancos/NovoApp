import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '../componentes/sidebar/sidebar';
import { useNavigation } from '@react-navigation/native';

interface GlobalLayoutProps {
    headerComponent?: React.ReactNode;
    children: React.ReactNode;
    showBackButton?: boolean;  // Nova propriedade
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ headerComponent, children, showBackButton }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const navigation: any = useNavigation();  // Usando "any" para contornar problemas de tipo

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.menuIcon} onPress={() => setSidebarVisible(!sidebarVisible)}>
                    <Icon name="bars" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {headerComponent}
                </View>
                {
    showBackButton && (
        <TouchableOpacity 
            style={styles.backIcon} 
            onPress={() => {
                navigation.goBack();
                setSidebarVisible(false);
            }}
        >
            <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
    )
}

            </View>
            
            <View style={styles.contentContainer}>
                {sidebarVisible && (
                    <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
                        <View style={styles.sidebarOverlay} />
                    </TouchableWithoutFeedback>
                )}

                {sidebarVisible && <Sidebar />}
                
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
        backgroundColor: 'skyblue',
    },
    contentContainer: {
        flex: 1,
    },
    menuIcon: {
        padding: 10,
    },
    backIcon: {
        padding: 10,
    },
    sidebarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //backgroundColor: 'rgba(0,0,0,0.3)',
    }
});

export default GlobalLayout;
