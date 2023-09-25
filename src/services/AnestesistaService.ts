import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';

const URL_ANESTESISTA = '/anestesistas';

/**
 * Cria um novo anestesista.
 * @param data Dados do anestesista.
 * @returns Promise com a resposta da API.
 */
export const criarAnestesista = (data: any) => {
    return crudService.criar(URL_ANESTESISTA, data);
};

/**
 * Busca todos os anestesistas.
 * @returns Promise com a lista de anestesistas.
 */
export const obterAnestesistas = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_ANESTESISTA}?limit=${limit}&page=${page}`);
};


/**
 * Atualiza um anestesista existente.
 * @param id ID do anestesista.
 * @param data Dados atualizados do anestesista.
 * @returns Promise com a resposta da API.
 */
export const atualizarAnestesista = (id: number, data: any) => {
    return crudService.atualizar(`${URL_ANESTESISTA}/${id}`, data);
};

/**
 * Deleta um anestesista.
 * @param id ID do anestesista.
 * @returns Promise com a resposta da API.
 */
export const deletarAnestesista = (id: number) => {
    return crudService.deletar(`${URL_ANESTESISTA}/${id}`);
};


export const obterAnestesistaPorId = async (id: string) => {
    const endpoint = `${URL_ANESTESISTA}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch anestesista with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching anestesista:", error);
        throw error;
    }
}



