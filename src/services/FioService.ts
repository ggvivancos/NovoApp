import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_FIOS = '/fios'; // Atualizado para o endpoint de "Fios"

// Tipagem para os dados do "Fio"
interface FioData {
    nome: string; // Atualizado de "recurso" para "nome"
    descricao?: string;
    // "quantidadeDisponivel" removido, pois não está presente no modelo de "Fios"
}

export const obterDetalhesFiosPorAgendamentoId = async (agendamentoId: number) => {
    const endpoint = `/agendamentos/detalhesFios/${agendamentoId}`;

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch Fios details for Agendamento ID ${agendamentoId}`);
        }
        const data = await response.json();
        return data; // Retorna os dados que incluem os fios e suas quantidades necessárias
    } catch (error) {
        console.error("Error fetching Fios details:", error);
        throw error;
    }
};

// Cria um novo "Fio"
export const criarFio = (data: FioData) => {
    return crudService.criar(URL_FIOS, data);
};

// Busca todos os "Fios"
export const obterFios = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_FIOS}?limit=${limit}&page=${page}`);
};

// Atualiza um "Fio" existente
export const atualizarFio = (id: number, data: FioData) => {
    return crudService.atualizar(`${URL_FIOS}/${id}`, data);
};

// Deleta um "Fio"
export const deletarFio = (id: number) => {
    return crudService.deletar(`${URL_FIOS}/${id}`);
};

// Obtém um "Fio" por ID
export const obterFioPorId = async (id: string) => {
    const endpoint = `${URL_FIOS}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch Fio with ID ${id}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Fio:", error);
        throw error;
    }
}

// Busca todos os "Fios"
export const obterTodosFios = () => {
    return crudService.ler(`${URL_FIOS}?all=true`);
};
