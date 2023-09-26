import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '../componentes/sidebar/sidebar';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/themes';  // Importar cores
import { scale, moderateScale } from 'react-native-size-matters';  // Importar funções do react-native-size-matters

interface GlobalLayoutProps {
    headerComponent?: React.ReactNode;
    children: React.ReactNode;
    showBackButton?: boolean;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ headerComponent, children, showBackButton }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const navigation: any = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.menuIcon} onPress={() => setSidebarVisible(!sidebarVisible)}>
                    <Icon name="bars" size={moderateScale(24)} color={colors.text} />
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
                            <Icon name="arrow-left" size={moderateScale(24)} color={colors.text} />
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
        backgroundColor: colors.primary,
    },
    contentContainer: {
        flex: 1,
    },
    menuIcon: {
        padding: moderateScale(10),
    },
    backIcon: {
        padding: moderateScale(10),
    },
    sidebarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});

export default GlobalLayout;
