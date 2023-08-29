import React from 'react';
import { ScrollView, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

interface Props {
    width: number;
    height: number;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    style?: React.CSSProperties;
}

const DESLOCAMENTO = 100;

const ComponenteGrafico: React.FC<Props> = React.forwardRef((props, ref) => {
    const { width, height, onScroll } = props;
    const spaceBetweenHours = 100;
    const currentHour = new Date().getHours() - 5;
    const barPosition = currentHour * spaceBetweenHours - (spaceBetweenHours / 2);
    const rectHeight = height / 10;  
    const rectSpacing = height / 20; 

    const rectangleColors = ['#FFDDDD', '#DDFFDD', '#DDDFFF', '#FFFFDD'];

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
                    {[...Array(25)].map((_, xIndex) => (
                        [...Array(5)].map((_, yIndex) => (
                            <Rect
                                key={"rect-x-" + xIndex + "-y-" + yIndex}
                                x={xIndex * spaceBetweenHours + DESLOCAMENTO - (spaceBetweenHours / 2)}
                                y={(rectHeight + rectSpacing) * yIndex}
                                width={spaceBetweenHours}
                                height={rectHeight}
                                fill={rectangleColors[xIndex % rectangleColors.length]}
                            />
                        ))
                    ))}
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
