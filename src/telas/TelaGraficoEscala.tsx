import React, { useRef, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import ComponenteBarraHorarios, { BARRA_HORARIOS_ALTURA } from '../componentes/ComponenteBarraHorarios';
import ComponenteGrafico from '../componentes/ComponenteGrafico';
import ComponenteListaDeAnestesistas from '../componentes/ComponenteListaDeAnestesistas';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const TelaGraficoEscala: React.FC = () => {
     const anestesistas = [
        { id: 1, posicao: 'C6', nome: 'Caio' },
        { id: 2, posicao: 'C12', nome: 'Gabriel' },
        { id: 3, posicao: 'C13-23', nome: 'Matheus' },
        { id: 4, posicao: '1', nome: 'Stefano' },
        { id: 5, posicao: '2', nome: 'José Rodolfo' },
        { id: 6, posicao: '3', nome: 'Vivancos' },
        { id: 7, posicao: '4', nome: 'Yogi' },
        { id: 8, posicao: '5', nome: 'Renato' },
        { id: 9, posicao: '6', nome: 'Colli' },
        { id: 10, posicao: '7', nome: 'Mucke' },
        //... (e assim por diante)
    ];
    
    const [horizontalScrollOffset, setHorizontalScrollOffset] = useState(0);
    const [verticalScrollOffset, setVerticalScrollOffset] = useState(0);

    return (
        <View style={{ flex: 1 }}>
            {/* Lista de Anestesistas */}
            <View 
                style={{ 
                    position: 'absolute', 
                    zIndex: 2, 
                    height: screenHeight, // 50 é a altura que você quer ocultar
                    top: BARRA_HORARIOS_ALTURA, // Começa abaixo da barra de horários
                    overflow: 'hidden',  // Corta qualquer texto que exceda este contêiner
                }}
            >
                <View 
                    style={{ 
                        transform: [{ translateY: -verticalScrollOffset - BARRA_HORARIOS_ALTURA }]
                    }}
                >
                    <ComponenteListaDeAnestesistas anestesistas={anestesistas} height={screenHeight} />
                </View>
            </View>

            {/* Barra de Horários */}
            <View style={{ 
                zIndex: 2, 
                marginLeft: 150, 
                width: screenWidth, 
                overflow: 'hidden'
            }}>
                <View style={{ transform: [{ translateX: -horizontalScrollOffset }] }}>
                    <ComponenteBarraHorarios width={screenWidth * 3.6} />
                </View>
            </View>

            <ScrollView 
                style={{ flex: 1, marginTop: 0, marginLeft: 150 }}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => {
                    setVerticalScrollOffset(event.nativeEvent.contentOffset.y);
                }}
            >
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                        setHorizontalScrollOffset(event.nativeEvent.contentOffset.x);
                    }}
                >
                    <ComponenteGrafico 
                        width={screenWidth * 3.6}
                        height={screenHeight * 2} 
                    />
                </ScrollView>
            </ScrollView>
        </View>
    );
};

export default TelaGraficoEscala;
