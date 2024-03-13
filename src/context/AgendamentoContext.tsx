import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DadosEtapa1, DadosEtapa2, DadosEtapa3, DadosEtapa4, DadosEtapa5 } from '../types/types';
import { AgendamentoData, DadosAgendamentoApi } from '../types';

// Defina uma interface para os dados de cada etapa


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
    estaAvancando: boolean;
    setEstaAvancando: (estaAvancando: boolean) => void;
    
    carregarDadosAgendamento: (dados: any) => void; // Adicione esta linha

}>({
    dadosEtapa1: null, salvarDadosEtapa1: () => {},
    dadosEtapa2: null, salvarDadosEtapa2: () => {},
    dadosEtapa3: null, salvarDadosEtapa3: () => {},
    dadosEtapa4: null, salvarDadosEtapa4: () => {},
    dadosEtapa5: null, salvarDadosEtapa5: () => {},
    estaAvancando: true,
    setEstaAvancando: (estaAvancando: boolean) => {},
    limparDadosAgendamento: () => {},
    carregarDadosAgendamento: () => {} 

});



// Crie um componente Provider
export const AgendamentoProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [dadosEtapa1, setDadosEtapa1] = useState<DadosEtapa1 | null>(null);
    const [dadosEtapa2, setDadosEtapa2] = useState<DadosEtapa2 | null>(null);
    const [dadosEtapa3, setDadosEtapa3] = useState<DadosEtapa3 | null>(null);
    const [dadosEtapa4, setDadosEtapa4] = useState<DadosEtapa4 | null>(null);
    const [dadosEtapa5, setDadosEtapa5] = useState<DadosEtapa5 | null>(null);
    const [estaAvancando, _setEstaAvancando] = useState(true);
    const setEstaAvancandoComLog = (novoValor: boolean) => {
        console.log(`Alterando estado 'estaAvancando' de ${estaAvancando} para ${novoValor}`);
        _setEstaAvancando(novoValor);
    };
    

    const salvarDadosEtapa1 = (dados: DadosEtapa1) => {
    console.log("Salvando dados da Etapa 1:", dados);
    setDadosEtapa1(dados);


};
    

    const salvarDadosEtapa2 = (dados: DadosEtapa2) => {
        console.log("Salvando dados da Etapa 2:", dados);
        setDadosEtapa2(dados);
    };

    const salvarDadosEtapa3 = (dados: DadosEtapa3) => {
        console.log("Salvando dados da Etapa 3 no contexto:", dados);
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

        const formatDate = (dateString: string | number | Date) => {
            const date = new Date(dateString);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        };
        
        const formatTime = (timeString: string) => {
            const time = new Date(`1970-01-01T${timeString}Z`);
            return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
        };


        const carregarDadosAgendamento = (dados: DadosAgendamentoApi) => {
            console.log("Carregando dados no contexto:", dados);

            const dataFormatada = formatDate(dados.datadacirurgia);
            const horaInicioFormatada = formatTime(dados.horainicio);
        
            // Mapeamento de IDs para seleções que originalmente esperavam arrays de IDs ou valores simples.
            const cirurgioesIds = dados.Cirurgiaos?.map(cirurgiao => cirurgiao.id) ?? [];
            const procedimentosIds = dados.Procedimentos?.map(procedimento => procedimento.id) ?? [];
            const conveniosIds = dados.Convenios?.map(convenio => convenio.id) ?? [];
            const recursosComplementaresIds = dados.recursocomplementars?.map(recurso => recurso.id) ?? [];
            const opmesIds = dados.OPMEs?.map(opme => opme.id) ?? [];
            const fornecedoresIds = dados.Fornecedors?.map(fornecedor => fornecedor.id) ?? [];
            const instrumentaisIds = dados.Instrumentals?.map(instrumental => instrumental.id) ?? [];
            const fiosComQuantidade = dados.Fios?.map(fio => ({
                id: fio.id,
                nome: fio.nome,
                AgendamentoFios: {
                    quantidadeNecessaria: fio.AgendamentoFios.quantidadeNecessaria
                }
            })) ?? [];
                    
            setDadosEtapa1({
                id: dados.id,
                dataSelecionada: dados.datadacirurgia,
                horarioInicio: dados.horainicio,
                duracao: dados.duracao,
                hospitalId: dados.Hospital?.id ?? null,
                statusId: dados.Status?.id ?? null,
                cirurgioesSelecionados: cirurgioesIds,
                salaDeCirurgiaId: dados.SaladeCirurgia?.id ?? null,
                setorId: dados.Setor?.id ?? null,
                caraterprocedimento: dados.caraterprocedimento ?? '',
                tipoprocedimento: dados.tipoprocedimento ?? '',
            });
        
            setDadosEtapa2({
                pacienteId: dados.Paciente?.id ?? undefined,
                pacienteProvisorioId: dados.PacienteProvisorio?.id ?? undefined,
                statusPaciente: dados.statusPaciente,
            });
        
            setDadosEtapa3({
                procedimentosSelecionados: procedimentosIds,
                conveniosSelecionados: conveniosIds,
                lateralidade: dados.lateralidade,
                matricula: dados.matricula ?? '', // Asumindo que o campo matricula existe em PacienteData
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
                tipoDeAcomodacao: dados.tipoDeAcomodacao,
                mudancaDeAcomodacao: dados.mudancaDeAcomodacao,
                grupoDeAnestesiaSelecionado: dados.GrupoDeAnestesium?.id ?? null,
                anestesistaSelecionado: dados.Anestesistum?.id ?? null,
            });
        
            setDadosEtapa5({
                materiaisEspeciais: recursosComplementaresIds,
                opmesSelecionadas: opmesIds,
                fornecedoresSelecionados: fornecedoresIds,
                instrumentaisSelecionados: instrumentaisIds,
                fiosComQuantidade: fiosComQuantidade,
                observacoes: dados.observacoes,
            });
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
            estaAvancando,
            setEstaAvancando: setEstaAvancandoComLog, // Atualizado para usar a função com log
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
