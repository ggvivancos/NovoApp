import * as crudService from './crudservice';
import { AgendamentoData } from '../types'; // Ajuste o caminho conforme necessário



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




// As funções abaixo permanecem inalteradas, pois elas lidam com a interface AgendamentoData
export const criarAgendamento = (data: AgendamentoData) => {
    return crudService.criar(URL_AGENDAMENTO, data);
};

export const obterAgendamentosDetalhados = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_AGENDAMENTO}?limit=${limit}&page=${page}&includeDetails=true`);
};

// Função para obter agendamentos básicos
export const obterAgendamentosBasicos = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_AGENDAMENTO}?limit=${limit}&page=${page}&includeDetails=false`);
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
