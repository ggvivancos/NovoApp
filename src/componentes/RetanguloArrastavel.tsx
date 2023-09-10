import React, { useState } from 'react';
import { Text, Dimensions, View } from 'react-native';
import { PanGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ScrollView } from 'react-native';
import DetalhesProcedimentoModal from './DetalhesProcedimentoModal';

const DESLOCAMENTO = 100;
const ALTURA_ANESTESISTA = 70;
const ALTURA_DO_RETANGULO = 50;
const spaceBetweenHours = 100;
const SCREEN_WIDTH = Dimensions.get('window').width;
const pixelsPorHora = spaceBetweenHours;  // Tamanho de uma hora no gráfico
const pixelsPorMinuto = pixelsPorHora / 60;

const hospitalColors: { [key: string]: string } = {
    'Hospital A': '#FF8888',
    'Hospital B': '#88FF88',
    'Hospital C': '#8888FF',
    'Hospital D': '#FFFF88',
    'Hospital E': '#FF88FF',
};

interface RetanguloArrastavelProps {
    scrollViewRef: React.RefObject<ScrollView>;
    data: Date;
    horaInicio: string;
    duracao: number;
    posicaoAnestesista: number;
    hospital: string;
    cirurgiao: string;
    color: string;
    cirurgia: string;
}

function hourToXPosition(horaInicio: string): number {
    const [hours, minutes] = horaInicio.split(":").map(Number);
    return (hours + minutes / 60) * spaceBetweenHours + DESLOCAMENTO - (spaceBetweenHours * 7);
}

function getLuminance(hexColor: string): number {
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;
    return (0.299 * r + 0.587 * g + 0.114 * b);
}

function getTextColorBasedOnBackground(hexColor: string): string {
    return getLuminance(hexColor) > 0.8 ? 'darkblue' : 'white';
}

const RetanguloArrastavel: React.FC<RetanguloArrastavelProps> = ({
    scrollViewRef,
    horaInicio,
    duracao,
    posicaoAnestesista,
    hospital,
    cirurgiao,
    color,
    data,
    cirurgia,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const handleCloseModal = () => {
        setModalVisible(false);
    };
    const handleLongPress = () => {
        setModalVisible(true);
    };

    const startX = hourToXPosition(horaInicio);
    const rectWidth = duracao * spaceBetweenHours;
    const startY = posicaoAnestesista * ALTURA_ANESTESISTA - (ALTURA_ANESTESISTA) / 2;

    const translateX = useSharedValue(startX);
    const translateY = useSharedValue(startY - (ALTURA_DO_RETANGULO / 2));
    const [novaHoraInicio, setNovaHoraInicio] = useState(horaInicio); // FUNÇÃO PARA MUDAR HORÁRIO DE INICIO
    const [novaPosicaoAnestesista, setNovaPosicaoAnestesista] = useState(posicaoAnestesista); //// FUNÇÃO PARA MUDAR POSIÇÃO DO ANESTESISTA

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (event, ctx) => {
            ctx.startX = translateX.value;
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            let newTranslateX = ctx.startX + event.translationX;
            let newTranslateY = ctx.startY + event.translationY;
    
            // Garantindo que o retângulo seja arrastado apenas dentro dos limites do gráfico
            newTranslateX = Math.min(Math.max(newTranslateX, 0), SCREEN_WIDTH*2);
    
            // Ajustando a posição Y para sempre se alinhar ao anestesista
            const snappedY = Math.round(newTranslateY / ALTURA_ANESTESISTA) * ALTURA_ANESTESISTA + 
                             (ALTURA_ANESTESISTA - ALTURA_DO_RETANGULO) / 2;
    
            // Calculando a nova hora de início com base na posição X
            const hours = Math.floor(newTranslateX / pixelsPorHora);
            const minutes = Math.floor((newTranslateX % pixelsPorHora) / pixelsPorMinuto);
            const newStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
            // TODO: Atualize o estado ou outra variável com newStartTime
    
            translateX.value = newTranslateX;
            translateY.value = withSpring(snappedY);
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value }
            ],
        };
    });

    const hospitalColor = hospitalColors[hospital] || '#000000'; 
    const textColor = getTextColorBasedOnBackground(hospitalColor);

    return (
        <>
            <PanGestureHandler onGestureEvent={onGestureEvent} simultaneousHandlers={scrollViewRef}>
                <Animated.View style={[
                    {
                        position: 'absolute',
                        left: startX,
                        width: rectWidth,
                        height: ALTURA_DO_RETANGULO,
                        backgroundColor: hospitalColor,
                        borderRadius: 10,
                    },
                    animatedStyle
                ]}>
                    <LongPressGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                            if (nativeEvent.state === State.ACTIVE) {
                                handleLongPress();
                            }
                        }}
                        minDurationMs={500}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: textColor,
                                paddingLeft: 10,
                                paddingTop: ALTURA_DO_RETANGULO * 0.05
                            }}>
                                {hospital}
                            </Text>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: textColor,
                                paddingLeft: 10,
                                paddingTop: ALTURA_DO_RETANGULO * 0.05
                            }}>
                                {cirurgiao}
                            </Text>
                        </View>
                    </LongPressGestureHandler>
                </Animated.View>
            </PanGestureHandler>

            <DetalhesProcedimentoModal
                visible={modalVisible}
                onRequestClose={handleCloseModal}
                hospital={hospital}
                cirurgiao={cirurgiao}
                data={data}
                horaInicio={horaInicio}
                duracao={duracao}
                procedimento={cirurgia}
            />
        </>
    );
}

export default RetanguloArrastavel;
