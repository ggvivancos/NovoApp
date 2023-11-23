// ColorPalette.tsx

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const CORES = [
    // Vermelhos e rosas
    '#FFD1DC', '#FFB3BA', '#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#FF4500', '#FA8072',

    // Laranjas e amarelos
    '#FFCB85', '#FFA07A', '#FFA500', '#FF8C00', '#FF6347', '#FF7F50', '#FFD700', '#FFEC8B',

    // Verdes
    '#B0E57C', '#98FB98', '#9ACD32', '#32CD32', '#00FF7F', '#00FA9A', '#00FF00', '#7FFF00',

    // Azuis e turquesas
    '#B0E0E6', '#87CEFA', '#1E90FF', '#4682B4', '#00CED1', '#00FFFF', '#20B2AA', '#48D1CC',

    // Roxos e magentas
    '#BA55D3', '#8B008B', '#9400D3', '#9932CC', '#8A2BE2', '#9370DB', '#DDA0DD', '#DA70D6',

    
    '#D3D3D3', '#C0C0C0', '#A9A9A9', '#808080', '#696969', '#778899', '#708090', '#2F4F4F',

    
    '#D2691E', '#8B4513', '#A0522D', '#BC8F8F', '#F4A460'
];


const PaletaDeCores = ({ onColorSelect }: { onColorSelect: (color: string) => void }) => {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            {CORES.map(color => (
                <TouchableOpacity
                    key={color}
                    style={[
                        styles.colorBox,
                        { backgroundColor: color },
                        selected === color ? styles.selected : {}
                    ]}
                    onPress={() => {
                        setSelected(color);
                        onColorSelect(color);
                    }}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    colorBox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        margin: 3,
    },
    selected: {
        borderWidth: 2,
        borderColor: '#000',
    }
});

export default PaletaDeCores;
