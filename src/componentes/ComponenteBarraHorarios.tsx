import React from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Text } from 'react-native-svg';

export const BARRA_HORARIOS_ALTURA = 50; // Definindo a constante

interface BarraHorariosProps {
    width: number;
    style?: React.CSSProperties;
    ref?: React.Ref<ScrollView>;  // Permita que o ScrollView seja referenciado pelo componente pai.
}

const ComponenteBarraHorarios: React.FC<BarraHorariosProps> = React.forwardRef((props, ref) => {
    const { width } = props;
    const spaceBetweenHours = 100; // O espaçamento entre cada hora.
    const DESLOCAMENTO = 100 + spaceBetweenHours / 2; // Um valor de deslocamento para iniciar a escala mais à direita.

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            scrollEnabled={false}  // Impede que o usuário role diretamente na barra.
            ref={ref as any}  // Passe a ref para o ScrollView.
            style={{ width }}
        >
            <View style={{ width }}>
                <Svg width={width} height={BARRA_HORARIOS_ALTURA.toString()}> 
                    {[...Array(25)].map((_, index) => (
                        <Text
                            key={`hour-${index}`}
                            x={index * spaceBetweenHours + DESLOCAMENTO}
                            y="30" 
                            fontSize="16" 
                            textAnchor="middle" 
                            fontWeight="bold"
                        >
                            {String((6 + index) % 24).padStart(2, '0')}:00
                        </Text>
                    ))}
                </Svg>
            </View>
        </ScrollView>
    );
});

export default ComponenteBarraHorarios;
