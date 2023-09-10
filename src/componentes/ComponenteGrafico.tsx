import React from 'react';
import { View, ScrollView } from 'react-native';
import { Svg, Rect, Text, Line } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RetanguloArrastavel from './RetanguloArrastavel';

const DESLOCAMENTO = 100;
const ALTURA_ANESTESISTA = 70;
const ALTURA_DO_RETANGULO = 50;

const hospitalColors: { [key: string]: string } = {
    'Hospital A': '#FF8888',
    'Hospital B': '#88FF88',
    'Hospital C': '#8888FF',
    'Hospital D': '#FFFF88',
    'Hospital E': '#FF88FF',
    // Adicione mais hospitais e cores conforme necessário
};

interface Procedimento {
    data: Date;
    horaInicio: string; // formato "HH:mm"
    duracao: number; // em horas
    hospital: string;
    setor: string;
    cirurgiao: string;
    cirurgia: string;
    cor: string;
    posicaoAnestesista: number; // Novo campo para representar a linha no gráfico
}

interface Props {
    width: number;
    height: number;
    onScroll?: (event: any) => void;
    style?: React.CSSProperties;
    procedimentos: Procedimento[];
}

const ComponenteGrafico: React.FC<Props> = React.forwardRef((props, ref) => {
    const scrollViewRef = React.useRef(null);
    const { width, height, onScroll } = props;
    const spaceBetweenHours = 100;
    const currentHour = new Date().getHours() - 5;
    const barPosition = currentHour * spaceBetweenHours - (spaceBetweenHours / 2);

    function hourToXPosition(horaInicio: string, spaceBetweenHours: number): number {
        const [hours, minutes] = horaInicio.split(":").map(Number);
        return (hours + minutes / 60) * spaceBetweenHours + DESLOCAMENTO - (spaceBetweenHours*7);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView
            
                horizontal 
                showsHorizontalScrollIndicator={false} 
                scrollEventThrottle={10000}
                onScroll={onScroll}
                ref={scrollViewRef}
            >
                <View style={{ width }}>
                    <Svg width={width} height={height} style={{ transform: [{ translateX: 13 }] }}>
                         {/* Linhas de hora completa - CINZAS */}
                    {[...Array(25)].map((_, index) => (
                        <Line 
                            key={"line-" + index}
                            x1={index * spaceBetweenHours + DESLOCAMENTO} 
                            y1="10" 
                            x2={index * spaceBetweenHours + DESLOCAMENTO} 
                            y2={height} 
                            stroke="skyblue" 
                            strokeWidth="1.5"
                        />
                    ))}
                    {/* Linhas de meia hora - PRETAS */}
                    {[...Array(24)].map((_, index) => (
                        <Line 
                            key={"line-half-" + index}
                            x1={index * spaceBetweenHours + (spaceBetweenHours / 2) + DESLOCAMENTO} 
                            y1="10" 
                            x2={index * spaceBetweenHours + (spaceBetweenHours / 2) + DESLOCAMENTO} 
                            y2={height} 
                            stroke="darkblue" 
                            strokeWidth="2.5"
                        />
                    ))}

{props.procedimentos.map((procedimento, index) => {
    const startX = hourToXPosition(procedimento.horaInicio, spaceBetweenHours);
    const rectWidth = procedimento.duracao * spaceBetweenHours;
    const startY = procedimento.posicaoAnestesista * ALTURA_ANESTESISTA + (ALTURA_ANESTESISTA - ALTURA_DO_RETANGULO) / 2;
    const hospitalColor = hospitalColors[procedimento.hospital] || '#000000'; // Fallback para preto caso não encontre a cor
    const textPadding = 10;  // ajuste conforme necessário


    return (
        <RetanguloArrastavel
        key={"procedimento-" + index}
        scrollViewRef={scrollViewRef}
        horaInicio={procedimento.horaInicio}
        duracao={procedimento.duracao}
        posicaoAnestesista={procedimento.posicaoAnestesista}
        hospital={procedimento.hospital}
        cirurgiao={procedimento.cirurgiao}
        color={hospitalColor}
        data={procedimento.data}
        cirurgia={procedimento.cirurgia}
    />
);
})}
       
                       
                        <Rect 
                            x={barPosition} 
                            y={0} 
                            width={20} 
                            height={height} 
                            fill="rgba(255,0,0,0.2)"
                        />
                    </Svg>

                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
});

export default ComponenteGrafico;
