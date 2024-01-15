import React, { createContext, useContext, useState, ReactNode } from 'react';

// Defina uma interface para os dados de cada etapa
export interface DadosEtapa1 {
    dataSelecionada: string;
    horarioInicio: string;
    duracao: string;
    cirurgioesSelecionados: number[];
    statusId: number;
    hospitalId: number; // Novo campo
    setorId: number | null; // Novo campo
    salaDeCirurgiaId: number | null; // Novo campo
}

export interface DadosEtapa2 {
    pacienteId: number;
    // Outros campos da Etapa 2, se necessário
}

export interface DadosEtapa3 {
    procedimentosSelecionados: number[];
    conveniosSelecionados: number[];
    lateralidade: string;
    planoId: number | null;
    matricula: string;
    // Outros campos da Etapa 3, se necessário
}

export interface DadosEtapa4 {
    utiPedida: boolean;
    utiConfirmada: boolean;
    hemoderivadosPedido: boolean;
    hemoderivadosConfirmado: boolean;
    apa: boolean;
    leito: string;
    aviso: string;
    prontuario: string;
    pacote: boolean;
    grupoDeAnestesiaSelecionado: number | null;
    anestesistaSelecionado: number | null;
    // Outros campos da Etapa 4, se necessário
}

export interface DadosEtapa5 {
    materiaisEspeciais: number[];
   opmesSelecionadas: number[];
    fornecedoresSelecionados: number[];
    // Outros campos da Etapa 5, se necessário
}

// Crie o contexto com um valor padrão
const AgendamentoContext = createContext<{
    dadosEtapa1: DadosEtapa1 | null;
    salvarDadosEtapa1: (dados: DadosEtapa1) => void;
    dadosEtapa2: DadosEtapa2 | null;
    salvarDadosEtapa2: (dados: DadosEtapa2) => void;
    dadosEtapa3: DadosEtapa3 | null;
    salvarDadosEtapa3: (dados: DadosEtapa3) => void;
    dadosEtapa4: DadosEtapa4 | null;
    salvarDadosEtapa4: (dados: DadosEtapa4) => void;
    dadosEtapa5: DadosEtapa5 | null;
    salvarDadosEtapa5: (dados: DadosEtapa5) => void;
    limparDadosAgendamento: () => void;
    
    carregarDadosAgendamento: (dados: any) => void; // Adicione esta linha

}>({
    dadosEtapa1: null, salvarDadosEtapa1: () => {},
    dadosEtapa2: null, salvarDadosEtapa2: () => {},
    dadosEtapa3: null, salvarDadosEtapa3: () => {},
    dadosEtapa4: null, salvarDadosEtapa4: () => {},
    dadosEtapa5: null, salvarDadosEtapa5: () => {},
    limparDadosAgendamento: () => {},
    carregarDadosAgendamento: () => {} // Correção: substitua por uma função vazia

});

// Crie um componente Provider
export const AgendamentoProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [dadosEtapa1, setDadosEtapa1] = useState<DadosEtapa1 | null>(null);
    const [dadosEtapa2, setDadosEtapa2] = useState<DadosEtapa2 | null>(null);
    const [dadosEtapa3, setDadosEtapa3] = useState<DadosEtapa3 | null>(null);
    const [dadosEtapa4, setDadosEtapa4] = useState<DadosEtapa4 | null>(null);
    const [dadosEtapa5, setDadosEtapa5] = useState<DadosEtapa5 | null>(null);

    const salvarDadosEtapa1 = (dados: DadosEtapa1) => {
        console.log("Salvando dados da Etapa 1:", dados);
        setDadosEtapa1(dados);
    };

    const salvarDadosEtapa2 = (dados: DadosEtapa2) => {
        console.log("Salvando dados da Etapa 2:", dados);
        setDadosEtapa2(dados);
    };

    const salvarDadosEtapa3 = (dados: DadosEtapa3) => {
        console.log("Salvando dados da Etapa 3:", dados);
        setDadosEtapa3(dados);
    };

    const salvarDadosEtapa4 = (dados: DadosEtapa4) => {
        console.log("Salvando dados da Etapa 4:", dados);
        setDadosEtapa4(dados);
        };

    const salvarDadosEtapa5 = (dados: DadosEtapa5) => {
            console.log("Salvando dados da Etapa 5:", dados);
            setDadosEtapa5(dados);
        };
        
    
     const limparDadosAgendamento = () => {
            console.log("Limpando todos os dados do agendamento");
            setDadosEtapa1(null);
            setDadosEtapa2(null);
            setDadosEtapa3(null);
            setDadosEtapa4(null);
            setDadosEtapa5(null);
        };


    const carregarDadosAgendamento = (dados: any) => {
        setDadosEtapa1({
            dataSelecionada: dados.datadacirurgia,
            horarioInicio: dados.horainicio,
            duracao: dados.duracao,
            cirurgioesSelecionados: dados.Cirurgiaos ? dados.Cirurgiaos.map(c => c.id) : [],
            statusId: dados.statusId,
            hospitalId: dados.hospitalId,
            setorId: dados.setorId,
            salaDeCirurgiaId: dados.SaladeCirurgiaId,
        });
    
        setDadosEtapa2({
            pacienteId: dados.pacienteId,
            // ... outros campos da Etapa 2
        });
    
        setDadosEtapa3({
            procedimentosSelecionados: dados.Procedimentos ? dados.Procedimentos.map(p => p.id) : [],
            conveniosSelecionados: dados.Convenios ? dados.Convenios.map(c => c.id) : [],
            lateralidade: dados.lateralidade,
            planoId: dados.planoId,
            matricula: dados.matricula,
            // ... outros campos da Etapa 3
        });
    
        setDadosEtapa4({
            utiPedida: dados.utiPedida,
            utiConfirmada: dados.utiConfirmada,
            hemoderivadosPedido: dados.hemoderivadosPedido,
            hemoderivadosConfirmado: dados.hemoderivadosConfirmado,
            apa: dados.apa,
            leito: dados.leito,
            aviso: dados.aviso,
            prontuario: dados.prontuario,
            pacote: dados.pacote,
            grupoDeAnestesiaSelecionado: dados.grupodeanestesiaId,
            anestesistaSelecionado: dados.anestesistaId,
            // ... outros campos da Etapa 4
            });
            
            setDadosEtapa5({
                materiaisEspeciais: dados.recursosComplementaresId ? dados.recursosComplementaresId : [],
                opmesSelecionadas: dados.opmeId ? dados.opmeId : [],
                fornecedoresSelecionados: dados.fornecedoresId ? dados.fornecedoresId : [],
                // ... outros campos da Etapa 5
            });
            
    

    // Adicione mais lógica de carregamento se houver mais etapas
};

    return (
        <AgendamentoContext.Provider value={{
            dadosEtapa1, salvarDadosEtapa1,
            dadosEtapa2, salvarDadosEtapa2,
            dadosEtapa3, salvarDadosEtapa3,
            dadosEtapa4, salvarDadosEtapa4,
            dadosEtapa5, salvarDadosEtapa5,
            limparDadosAgendamento,
            carregarDadosAgendamento,
        }}>
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

export default AgendamentoContext;
