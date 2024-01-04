import React, { createContext, useContext, useState, ReactNode } from 'react';

// Defina uma interface para os dados da etapa 1
interface DadosEtapa1 {
    dataSelecionada: string;
    horarioInicio: string;
    duracao: string;
    cirurgioesSelecionados: number[];
}

// Crie o contexto com um valor padrão
const AgendamentoContext = createContext<{
    dadosEtapa1: DadosEtapa1 | null;
    salvarDadosEtapa1: (dados: DadosEtapa1) => void;
}>({
    dadosEtapa1: null,
    salvarDadosEtapa1: () => {},
});

// Crie um componente Provider
export const AgendamentoProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [dadosEtapa1, setDadosEtapa1] = useState<DadosEtapa1 | null>(null);

    const salvarDadosEtapa1 = (dados: DadosEtapa1) => {
        setDadosEtapa1(dados);
    };

    return (
        <AgendamentoContext.Provider value={{ dadosEtapa1, salvarDadosEtapa1 }}>
            {children}
        </AgendamentoContext.Provider>
    );
};

// Crie um hook personalizado para usar o contexto
export const useAgendamento = () => {
    const context = useContext(AgendamentoContext);
    if (!context) {
        throw new Error('useAgendamento deve ser usado dentro de um AgendamentoProvider');
    }
    return context;
};
