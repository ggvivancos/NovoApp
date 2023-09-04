import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { Value, add } = Animated;

export default function RetanguloArrastavel() {
    const translateX = new Value(0);
    const translateY = new Value(0);

    const onGestureEvent = Animated.event([
        {
            nativeEvent: {
                translationX: translateX,
                translationY: translateY
            }
        }
    ], { useNativeDriver: true });

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onGestureEvent}
        >
            <Animated.View style={{
                width: 100,
                height: 100,
                backgroundColor: 'blue',
                transform: [
                    { translateX },
                    { translateY }
                ]
            }} />
        </PanGestureHandler>
    );
}
