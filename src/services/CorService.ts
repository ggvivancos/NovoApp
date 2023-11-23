import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_COR = '/cores';

/**
 * Cria uma nova cor.
 * @param data Dados da cor.
 * @returns Promise com a resposta da API.
 */
export const criarCor = (data: any) => {
    return crudService.criar(URL_COR, data);
};

/**
 * Busca todas as cores.
 * @returns Promise com a lista de cores.
 */
export const obterCores = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_COR}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza uma cor existente.
 * @param id ID da cor.
 * @param data Dados atualizados da cor.
 * @returns Promise com a resposta da API.
 */
export const atualizarCor = (id: number, data: any) => {
    return crudService.atualizar(`${URL_COR}/${id}`, data);
};

/**
 * Deleta uma cor.
 * @param id ID da cor.
 * @returns Promise com a resposta da API.
 */
export const deletarCor = (id: number) => {
    return crudService.deletar(`${URL_COR}/${id}`);
};

export const obterCorPorId = async (id: string) => {
    const endpoint = `${URL_COR}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch cor with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching cor:", error);
        throw error;
    }
}

export const obterTodasCores = () => {
    return crudService.ler(URL_COR);
};
