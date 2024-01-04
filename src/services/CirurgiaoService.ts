import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';

const URL_CIRURGIAO = '/cirurgioes';

/**
 * Cria um novo cirurgião.
 * @param data Dados do cirurgião.
 * @returns Promise com a resposta da API.
 */
export const criarCirurgiao = (data: any) => {
    return crudService.criar(URL_CIRURGIAO, data);
};

/**
 * Busca todos os cirurgiões.
 * @returns Promise com a lista de cirurgiões.
 */
export const obterCirurgioes = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_CIRURGIAO}?limit=${limit}&page=${page}`);
};

export const obterTodosCirurgioes = () => {
    return crudService.ler(`${URL_CIRURGIAO}?all=true`);
};

/**
 * Atualiza um cirurgião existente.
 * @param id ID do cirurgião.
 * @param data Dados atualizados do cirurgião.
 * @returns Promise com a resposta da API.
 */
export const atualizarCirurgiao = (id: number, data: any) => {
    return crudService.atualizar(`${URL_CIRURGIAO}/${id}`, data);
};

/**
 * Deleta um cirurgião.
 * @param id ID do cirurgião.
 * @returns Promise com a resposta da API.
 */
export const deletarCirurgiao = (id: number) => {
    return crudService.deletar(`${URL_CIRURGIAO}/${id}`);
};

export const obterCirurgiaoPorId = async (id: string) => {
    const endpoint = `${URL_CIRURGIAO}/${id}`;
    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response body:", data);
        if (!response.ok) {
            throw new Error(`Failed to fetch cirurgião with ID ${id}`);
        }
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching cirurgião:", error);
        throw error;
    }
}