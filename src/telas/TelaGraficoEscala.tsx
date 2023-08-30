import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import ComponenteBarraHorarios, { BARRA_HORARIOS_ALTURA } from '../componentes/ComponenteBarraHorarios';
import ComponenteGrafico from '../componentes/ComponenteGrafico';
import ComponenteListaDeAnestesistas from '../componentes/ComponenteListaDeAnestesistas';
import NavegadorDeData from '../componentes/NavegadorDeData';

const ALTURA_ANESTESISTA = 50;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const TelaGraficoEscala: React.FC = () => {
    const [anestesistas, setAnestesistas] = useState([
        { id: 1, posicao: 'C6', nome: 'Caio' },
        { id: 2, posicao: 'C12', nome: 'Gabriel' },
        { id: 3, posicao: 'C13-23', nome: 'Matheus' },
        { id: 4, posicao: '1', nome: 'Stefano' },
        { id: 5, posicao: '2', nome: 'J. Rodolfo' },
        { id: 6, posicao: '3', nome: 'Vivancos' },
        { id: 7, posicao: '4', nome: 'Yogi' },
        { id: 8, posicao: '5', nome: 'Renato' },
        { id: 9, posicao: '6', nome: 'Colli' },
        { id: 10, posicao: '7', nome: 'Mucke' },
        { id: 11, posicao: '8', nome: 'Michel' },
        { id: 12, posicao: '9', nome: 'Samuel' },
        { id: 13, posicao: '10', nome: 'Nadim' },
        { id: 14, posicao: '11', nome: 'Oscar' },
        { id: 15, posicao: '12', nome: 'Edilson' },
        { id: 16, posicao: '13', nome: 'L. Felicio' },
        { id: 17, posicao: '14', nome: 'Shigella' },
        //... (e assim por diante)
    ]);

    const adicionarAnestesista = (novoAnestesista: { id: number, posicao: string, nome: string }) => {
        setAnestesistas(prevAnestesistas => [...prevAnestesistas, novoAnestesista]);
    }

    const excluirAnestesista = (id: number) => {
        setAnestesistas(prevAnestesistas => prevAnestesistas.filter(anestesista => anestesista.id !== id));
    }

    const [horizontalScrollOffset, setHorizontalScrollOffset] = useState(0);
    const [verticalScrollOffset, setVerticalScrollOffset] = useState(0);
    const [dataAtual, setDataAtual] = useState(new Date());
    const alturaListaAnestesistas = ALTURA_ANESTESISTA * anestesistas.length;
    

    return (
        <View style={{ flex: 1 }}>

            {/* Navegador de Data */}
            <NavegadorDeData 
                dataAtual={dataAtual} 
                onMudancaData={setDataAtual}
            />

            {/* Lista de Anestesistas */}
            <View 
                style={{ 
                    position: 'absolute', 
                    zIndex: 2, 
                    height: alturaListaAnestesistas + BARRA_HORARIOS_ALTURA, 
                    top: BARRA_HORARIOS_ALTURA*2,
                    overflow: 'hidden',
                }}
            >
                <View 
                    style={{ 
                        transform: [{ translateY: -verticalScrollOffset - (BARRA_HORARIOS_ALTURA * 0.7) }]
                    }}
                >
                    <ComponenteListaDeAnestesistas 
                            anestesistas={anestesistas} 
                            height={alturaListaAnestesistas*1.1} 
                         onAdicionar={adicionarAnestesista} 
                         onExcluir={excluirAnestesista}
                    />

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

            {/* Componente Gráfico */}
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
