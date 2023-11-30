import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';

const URL_STATUS = '/status';  // Alterado para a rota de status

/**
 * Cria um novo status.
 * @param data Dados do status.
 * @returns Promise com a resposta da API.
 */
export const criarStatus = (data: any) => {
    return crudService.criar(URL_STATUS, data);
};

/**
 * Busca todos os status.
 * @returns Promise com a lista de status.
 */
export const obterStatus = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_STATUS}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um status existente.
 * @param id ID do status.
 * @param data Dados atualizados do status.
 * @returns Promise com a resposta da API.
 */
export const atualizarStatus = (id: number, data: any) => {
    return crudService.atualizar(`${URL_STATUS}/${id}`, data);
};

/**
 * Deleta um status.
 * @param id ID do status.
 * @returns Promise com a resposta da API.
 */
export const deletarStatus = (id: number) => {
    return crudService.deletar(`${URL_STATUS}/${id}`);
};

/**
 * Busca um status pelo ID.
 * @param id ID do status.
 * @returns Dados do status.
 */
export const obterStatusPorId = async (id: string) => {
    const endpoint = `${URL_STATUS}/${id}`;  // Alterado para a rota de status

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch status with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching status:", error);
        throw error;
    }
}
