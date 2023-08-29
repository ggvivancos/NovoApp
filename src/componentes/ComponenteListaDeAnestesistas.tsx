import React from 'react';
import Svg, { Text } from 'react-native-svg';

interface Anestesista {
    id: number;
    posicao: string; // Mudando para string para permitir maior flexibilidade
    nome: string;
}

interface ListaDeAnestesistasProps {
    anestesistas: Anestesista[];
    height: number;
    style?: React.CSSProperties;
}

const ALTURA_BARRA_HORARIOS = 50; // A altura que você definiu para o ComponenteBarraHorarios

const ComponenteListaDeAnestesistas: React.FC<ListaDeAnestesistasProps> = ({ anestesistas, height,  }) => {
    const ESPACO_VERTICAL = 50; // Espaçamento vertical entre os anestesistas

    return (
<Svg width="150" height={height} style={{ transform: [{ translateY: ALTURA_BARRA_HORARIOS }] }}>
    {anestesistas.map((anest, index) => (
        <React.Fragment key={`anest-${anest.id}`}>
            <Text
                x="20"
                y={index * ESPACO_VERTICAL + 30}
                fontSize="16"
                textAnchor="start"
            >
                {anest.posicao}
            </Text>
            <Text
                x="80"
                y={index * ESPACO_VERTICAL + 30}
                fontSize="16"
                textAnchor="start"
            >
                {anest.nome}
            </Text>
        </React.Fragment>
    ))}
</Svg>

    );
};

export default ComponenteListaDeAnestesistas;
