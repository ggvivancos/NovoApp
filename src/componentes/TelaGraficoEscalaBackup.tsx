import React from 'react';
import { View, Dimensions } from 'react-native';
import ComponenteBarraHorarios from '../componentes/ComponenteBarraHorarios';
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

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <ComponenteListaDeAnestesistas anestesistas={anestesistas} height={screenHeight} />
            <View style={{ flexDirection: 'column', width: screenWidth * 2 }}>
                <ComponenteBarraHorarios width={screenWidth * 2} />
                <ComponenteGrafico width={screenWidth * 2} height={screenHeight} />
            </View>
        </View>
    );
};

export default TelaGraficoEscala;
