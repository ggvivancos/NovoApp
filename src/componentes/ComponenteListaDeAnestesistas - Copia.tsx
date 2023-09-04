import React from 'react';
import Svg, { Text, Rect } from 'react-native-svg';

interface Anestesista {
    id: number;
    posicao: string;
    nome: string;
}

interface ListaDeAnestesistasProps {
    anestesistas: Anestesista[];
    height: number;
    onAdicionar?: (anestesista: Anestesista) => void;
    onExcluir?: (id: number) => void;
}

const ALTURA_BARRA_HORARIOS = 50;

const ComponenteListaDeAnestesistas: React.FC<ListaDeAnestesistasProps> = ({ anestesistas, height, onAdicionar, onExcluir }) => {
    const ESPACO_VERTICAL = 50;

    const handleAdicionar = () => {
        // Aqui, você pode criar uma lógica para adicionar um novo anestesista (talvez abrindo um modal ou formulário)
        if (onAdicionar) {
            const novoAnestesista = {
                id: Date.now(),  // Exemplo de ID. Você pode querer algo mais sofisticado.
                posicao: 'NovaPosicao',
                nome: 'NovoNome',
            };
            onAdicionar(novoAnestesista);
        }
    };

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

                    {/* Botão de excluir (representado por um retângulo para simplificação) */}
                    <Rect
                        x="5"
                        y={index * ESPACO_VERTICAL + 13}
                        width="10"
                        height="20"
                        fill="red"
                        onPress={() => onExcluir && onExcluir(anest.id)}
                    />
                </React.Fragment>
            ))}

            {/* Botão de adicionar (representado por um retângulo para simplificação) */}
            <Rect
                x="5"
                y={anestesistas.length * ESPACO_VERTICAL}
                width="140"
                height="20"
                fill="green"
                onPress={handleAdicionar}
            />
        </Svg>
    );
};

export default ComponenteListaDeAnestesistas;
