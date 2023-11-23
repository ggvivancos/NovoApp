import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_PROCEDIMENTO = '/procedimentos';

// Defina uma interface para o tipo de dados dos procedimentos, se necessário
interface ProcedimentoData {
    // Defina as propriedades e tipos aqui, por exemplo:
    // nome: string;
    // codigoTUSS: string;
    // ...
}

/**
 * Cria um novo procedimento.
 * @param data Dados do procedimento.
 * @returns Promise com a resposta da API.
 */
export const criarProcedimento = (data: ProcedimentoData) => {
    return crudService.criar(URL_PROCEDIMENTO, data);
};

/**
 * Busca todos os procedimentos.
 * @returns Promise com a lista de procedimentos.
 */
export const obterProcedimentos = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_PROCEDIMENTO}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um procedimento existente.
 * @param id ID do procedimento.
 * @param data Dados atualizados do procedimento.
 * @returns Promise com a resposta da API.
 */
export const atualizarProcedimento = (id: number, data: ProcedimentoData) => {
    return crudService.atualizar(`${URL_PROCEDIMENTO}/${id}`, data);
};

/**
 * Deleta um procedimento.
 * @param id ID do procedimento.
 * @returns Promise com a resposta da API.
 */
export const deletarProcedimento = (id: number) => {
    return crudService.deletar(`${URL_PROCEDIMENTO}/${id}`);
};

export const obterProcedimentoPorId = async (id: string) => {
    const endpoint = `${URL_PROCEDIMENTO}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch procedimento with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching procedimento:", error);
        throw error;
    }
}

export const obterTodosProcedimentos = () => {
    return crudService.ler(URL_PROCEDIMENTO);
};
