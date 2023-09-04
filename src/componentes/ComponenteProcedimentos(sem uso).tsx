import React from 'react';
import { Procedimento } from './ProcedimentosAgendados';
import { spaceBetweenHours, DESLOCAMENTO } from './ComponenteBarraHorarios';  // Ajuste o caminho conforme necessário

interface ComponenteProcedimentoProps {
    procedimento: Procedimento;
}

const calcularPosicaoX = (horaInicio: string) => {
    const [hora, minuto] = horaInicio.split(':').map(Number);
    return hora * spaceBetweenHours + (minuto / 60) * spaceBetweenHours + DESLOCAMENTO;
};

const calcularLargura = (duracao: number) => {
    return duracao / 60 * spaceBetweenHours; // supondo que a duração seja em minutos
};

const ComponenteProcedimento: React.FC<ComponenteProcedimentoProps> = ({ procedimento }) => {
    const ALTURA_PROCEDIMENTO = 40;

    const posicaoX = calcularPosicaoX(procedimento.horaInicio);
    const largura = calcularLargura(procedimento.duracao);

    return (
        <div style={{
            position: 'absolute',
            left: `${posicaoX}px`,
            width: `${largura}px`,
            height: `${ALTURA_PROCEDIMENTO}px`,
            backgroundColor: procedimento.cor,
            borderRadius: '10px',
            padding: '10px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {procedimento.cirurgiao} - {procedimento.hospital}
        </div>
    );
}

export default ComponenteProcedimento;
