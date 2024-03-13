import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navegação/NavigationTypes';
import { colors, fonts } from '../../styles/themes';

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
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(onPress);
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <Animated.Text style={[
                styles.sidebarItem,
                isSubMenu && styles.subMenuItem,
                { transform: [{ scale: animation }] },
                fonts.regular
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
                    <Text style={[styles.sidebarItem, fonts.regular]}>{title}</Text>
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
                        {'>'}
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

    const handleClose = () => {
        Animated.timing(sidebarAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => onClose && onClose());
    };

    return (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <SidebarItem title="ESCALA DIÁRIA" onPress={() => { }} />
            <SidebarItem title="AGENDA DE PROCEDIMENTOS" onPress={() => { }} />

            <SubMenu title="BANCO DE DADOS">
            <SidebarItem title="Agendamentos" onPress={() => {
                    navigation.navigate('IndexAgendamento');
                    handleClose();
                }} />
                <SidebarItem title="Anestesistas" onPress={() => {
                    navigation.navigate('IndexAnestesista');
                    handleClose();
                }} />
                <SidebarItem title="Cirurgiões" onPress={() => { 
                    navigation.navigate('IndexCirurgiao');
                    handleClose();
                }} />
                <SidebarItem title="Cirurgias" onPress={() => { }} />
                <SidebarItem title="Cores" onPress={() => {
                    navigation.navigate('IndexCor');
                    handleClose();
                }} />
                <SidebarItem title="Convênios" onPress={() => {
                    navigation.navigate('IndexConvenio');
                    handleClose();
                }} />
                <SidebarItem title="Especialidades" onPress={() => {
                    navigation.navigate('IndexEspecialidade');
                    handleClose();
                }} />
                <SidebarItem title="Fios" onPress={() => {
                    navigation.navigate('IndexFio');
                    handleClose();
                }} />
                <SidebarItem title="Fornecedores" onPress={() => {
                    navigation.navigate('IndexFornecedor');
                    handleClose();
                }} />
                
                <SidebarItem title="Grupos de Anestesia" onPress={() => {
                    navigation.navigate('IndexGrupoDeAnestesia');
                    handleClose();
                }} />
                <SidebarItem title="Hospitais" onPress={() => {
                    navigation.navigate('IndexHospital');
                    handleClose();
                }} />
                <SidebarItem title="Instrumentais" onPress={() => {
                    navigation.navigate('IndexInstrumental');
                    handleClose();
                }} />
                <SidebarItem title="OPME" onPress={() => {
                    navigation.navigate('IndexOPME');
                    handleClose();
                }} />
                <SidebarItem title="Pacientes" onPress={() => {
                    navigation.navigate('IndexPaciente');
                    handleClose();
                }} />
                <SidebarItem title="Procedimentos" onPress={() => {
                    navigation.navigate('IndexProcedimento');
                    handleClose();
                }} />
                <SidebarItem title="Recursos Complementares" onPress={() => {
                    navigation.navigate('IndexRecursoComplementar');
                    handleClose();
                }} />
                <SidebarItem title="Status" onPress={() => {
                    navigation.navigate('IndexStatus');
                    handleClose();
                }} />
            </SubMenu>

            <SidebarItem title="ESTATÍSTICAS" onPress={() => { }} />
            <SidebarItem title="CONFIGURAÇÕES" onPress={() => { }} />
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        width: 200,
        height: "100%",
        backgroundColor: colors.primary,
        borderRightWidth: 0,
        borderRightColor: '#ddd',
        zIndex: 10
    },
    closeButton: {
        padding: 15,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        color: colors.text
    },
    sidebarItem: {
        padding: 15,
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
        color: colors.text,
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
        fontSize: 20,
        paddingRight: 25,
        color: colors.text
    }
});

export default Sidebar;
