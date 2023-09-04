// Inicio.tsx
import React from 'react';
import TelaGraficoEscala from './TelaGraficoEscala';
import ProcedimentosAgendados from '../componentes/ProcedimentosAgendados';

const Inicio: React.FC = () => {
    // Futuramente, aqui você pode adicionar lógica para verificar se o usuário está logado.
    // Se estiver, renderize a TelaGraficoPrincipal, se não, renderize a tela de login.

    return <TelaGraficoEscala procedimentos={ProcedimentosAgendados} />
}

export default Inicio;
