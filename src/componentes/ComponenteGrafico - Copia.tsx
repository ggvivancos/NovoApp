import React from 'react';
import { ScrollView, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Svg, { Line, Rect, Text } from 'react-native-svg';
import { Procedimento } from './ProcedimentosAgendados';  // ajuste o caminho conforme necessário

const hospitalColors: { [key: string]: string } = {
    'Hospital A': '#FF8888',
    'Hospital B': '#88FF88',
    'Hospital C': '#8888FF',
    'Hospital D': '#FFFF88',
    'Hospital E': '#FF88FF',
    // Adicione mais hospitais e cores conforme necessário
};
interface Props {
    width: number;
    height: number;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    style?: React.CSSProperties;
    procedimentos: Procedimento[];
}

const DESLOCAMENTO = 100;
const ALTURA_ANESTESISTA = 50;
const ALTURA_DO_RETANGULO = ALTURA_ANESTESISTA * 0.8;

const ComponenteGrafico: React.FC<Props> = React.forwardRef((props, ref) => {
    const { width, height, onScroll } = props;
    const spaceBetweenHours = 100;
    const currentHour = new Date().getHours() - 5;
    const barPosition = currentHour * spaceBetweenHours - (spaceBetweenHours / 2);

    function hourToXPosition(horaInicio: string, spaceBetweenHours: number): number {
        const [hours, minutes] = horaInicio.split(":").map(Number);
        return (hours + minutes / 60) * spaceBetweenHours + DESLOCAMENTO;
    }

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            scrollEventThrottle={10000}
            onScroll={onScroll}
            ref={ref as any}
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
                            stroke="#aaa" 
                            strokeWidth="2.0"
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
                            stroke="black" 
                            strokeWidth="1.5"
                        />
                    ))}

{props.procedimentos.map((procedimento, index) => {
    const startX = hourToXPosition(procedimento.horaInicio, spaceBetweenHours);
    const rectWidth = procedimento.duracao * spaceBetweenHours;
    const startY = index * ALTURA_ANESTESISTA + (ALTURA_ANESTESISTA - ALTURA_DO_RETANGULO) / 2;
    const hospitalColor = hospitalColors[procedimento.hospital] || '#000000'; // Fallback para preto caso não encontre a cor
    const textPadding = 10;  // ajuste conforme necessário


    return (
        <React.Fragment key={"procedimento-" + index}>
            <Rect
                x={startX}
                y={startY}
                width={rectWidth}
                height={ALTURA_DO_RETANGULO}
                fill={hospitalColor}
                rx={10}
            />
            <Text
                x={startX + textPadding}  // Centralizando o texto no retângulo
                y={startY + ALTURA_DO_RETANGULO*0.4}  // Posição para o hospital
                fontSize="16"  // Tamanho da fonte
                fontWeight="bold"  // Negrito
                fill="white"  // Cor do texto
                
            >
                {procedimento.hospital}
            </Text>
            <Text
                x={startX + textPadding}  // Centralizando o texto no retângulo
                y={startY + (ALTURA_DO_RETANGULO*0.8)}  // Posição para o cirurgião
                fontSize="13"  // Tamanho da fonte menor
                fontWeight="bold"  // Negrito
                fill="white"  // Cor do texto
                            >
                {procedimento.cirurgiao}
            </Text>
        </React.Fragment>
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
    );
});

export default ComponenteGrafico;
