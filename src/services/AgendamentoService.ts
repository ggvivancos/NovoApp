import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_AGENDAMENTO = '/agendamentos';

// Atualize a interface para refletir a nova estrutura de dados
interface StatusData {
    id: number;
    
    // outros campos...
}

interface OPMEData {
    id: number;
    descricao: string;
    // Outros campos que você possa precisar
}

interface FornecedorData {
    id: number;
    nome: string;
    // Outros campos que você possa precisar
}



export interface AgendamentoData {
    pacienteId: number;
    anestesistaId?: number;
    grupodeanestesiaId?: number;
    hospitalId: number;
    setorId?: number | null;
    statusId: number;
    SaladeCirurgiaId?: number;
    horainicio: string;
    duracao: string;
    utiPedida: boolean;
    utiConfirmada: boolean;
    hemoderivadosPedido: boolean;
    hemoderivadosConfirmado: boolean;
    apa: boolean;
    leito: string;
    observacao?: string;
    aviso?: string;
    prontuario?: string;
    lateralidade: string;
    pacote?: boolean;
    datadacirurgia: string;
    procedimentos: number[];
    cirurgioes: number[];
    convenios: number[];
    recursosComplementaresId?: number[];
    opmeId?: number[];
    fornecedoresId?: number[];
}
    // Adicione outros campos conforme necessário


// As funções abaixo permanecem inalteradas, pois elas lidam com a interface AgendamentoData
export const criarAgendamento = (data: AgendamentoData) => {
    return crudService.criar(URL_AGENDAMENTO, data);
};

export const obterAgendamentos = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_AGENDAMENTO}?limit=${limit}&page=${page}`);
};

export const atualizarAgendamento = (id: number, data: AgendamentoData) => {
    return crudService.atualizar(`${URL_AGENDAMENTO}/${id}`, data);
};

export const deletarAgendamento = (id: number) => {
    return crudService.deletar(`${URL_AGENDAMENTO}/${id}`);
};

export const obterAgendamentoPorId = async (id: number) => {
    const endpoint = `${URL_AGENDAMENTO}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch agendamento with ID ${id}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching agendamento:", error);
        throw error;
    }
};

export const obterTodosAgendamentos = () => {
    return crudService.ler(URL_AGENDAMENTO);
};
