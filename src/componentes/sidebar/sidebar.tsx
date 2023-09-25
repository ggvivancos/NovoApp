import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navegação/NavigationTypes';

interface SidebarProps {
    onItemSelect?: (itemId: number) => void;
    position?: 'left' | 'right';
    onClose?: () => void;
}

const SidebarItem: React.FC<{ title: string; onPress: () => void; isSubMenu?: boolean }> = ({ title, onPress, isSubMenu = false }) => {
    const animation = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 0.9,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start(onPress);
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <Animated.Text style={[
                styles.sidebarItem,
                isSubMenu && styles.subMenuItem,
                { transform: [{ scale: animation }] }
            ]}>
                {title}
            </Animated.Text>
        </TouchableWithoutFeedback>
    );
};

const SubMenu: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const animations = useRef(React.Children.toArray(children).map(() => new Animated.Value(0))).current;

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        if (isOpen) {
            animations.forEach((animation, index) => {
                Animated.sequence([
                    Animated.delay(index * 50),
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true
                    })
                ]).start();
            });

            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();

        } else {
            animations.forEach(animation => {
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }).start();
            });

            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }, [isOpen]);

    return (
        <View>
            <TouchableWithoutFeedback onPress={handleToggle}>
                <View style={styles.subMenuHeader}>
                    <Text style={styles.sidebarItem}>{title}</Text>
                    <Animated.Text style={[
                        styles.arrowIcon,
                        {
                            transform: [{
                                rotate: rotateAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '90deg']
                                })
                            }]
                        }
                    ]}>
                        {'> l'}
                    </Animated.Text>
                </View>
            </TouchableWithoutFeedback>
            {isOpen && (
                <View style={styles.subMenuItem}>
                    {React.Children.map(children, (child, index) => (
                        <Animated.View
                            style={{ opacity: animations[index], transform: [{ translateY: animations[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }}
                        >
                            {child}
                        </Animated.View>
                    ))}
                </View>
            )}
        </View>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ position = 'left', onClose, onItemSelect }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const sidebarAnim = useRef(new Animated.Value(-200)).current;

    useEffect(() => {
        Animated.timing(sidebarAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Text style={styles.closeButton}>×</Text>
            </TouchableWithoutFeedback>

            <SidebarItem title="ESCALA DIÁRIA" onPress={() => { }} />
            <SidebarItem title="AGENDA DE PROCEDIMENTOS" onPress={() => { }} />

            <SubMenu title="BANCO DE DADOS">
                <SidebarItem title="Anestesistas" onPress={() => {
                    navigation.navigate('IndexAnestesista');
                    onClose && onClose();
                }} />
                <SidebarItem title="Cirurgias" onPress={() => { }} />
                <SidebarItem title="Cirurgiões" onPress={() => { }} />
                <SidebarItem title="Grupos de Anestesia" onPress={() => { }} />
                <SidebarItem title="Hospitais" onPress={() => { }} />
                <SidebarItem title="Salas de Cirurgia" onPress={() => { }} />
                <SidebarItem title="Setores" onPress={() => { }} />
                <SidebarItem title="Procedimentos" onPress={() => { }} />
            </SubMenu>

            <SidebarItem title="ESTATÍSTICAS" onPress={() => { }} />
            <SidebarItem title="CONFIGURAÇÕES" onPress={() => { }} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        width: 200,
        height: "100%",
        backgroundColor: 'rgba(135, 206, 235, 1)',
        borderRightWidth: 0,
        borderRightColor: '#ddd',
        zIndex: 10
    },
    closeButton: {
        padding: 15,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        color: 'white'
    },
    sidebarItem: {
        padding: 15,
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
        color: 'white',
        fontSize: 16,
    },
    subMenuItem: {
        paddingLeft: 30
    },
    subMenuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    arrowIcon: {
        fontSize: 24,
        paddingRight: 15,
        color: 'white'
    }
});

export default Sidebar;
