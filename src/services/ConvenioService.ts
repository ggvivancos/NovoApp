import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_CONVENIO = '/convenios';

// Tipagem para os dados do convênio
interface ConvenioData {
    nome: string;
    nomeabreviado: string;
    cor?: string; // A coluna 'cor' é opcional
}

/**
 * Cria um novo convênio.
 * @param data Dados do convênio.
 * @returns Promise com a resposta da API.
 */
export const criarConvenio = (data: ConvenioData) => {
    // Aqui você pode adicionar validações para os dados, se necessário
    return crudService.criar(URL_CONVENIO, data);
};

/**
 * Busca todos os convênios.
 * @returns Promise com a lista de convênios.
 */
export const obterConvenios = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_CONVENIO}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um convênio existente.
 * @param id ID do convênio.
 * @param data Dados atualizados do convênio.
 * @returns Promise com a resposta da API.
 */
export const atualizarConvenio = (id: number, data: ConvenioData) => {
    // Aqui você pode adicionar validações para os dados, se necessário
    return crudService.atualizar(`${URL_CONVENIO}/${id}`, data);
};

/**
 * Deleta um convênio.
 * @param id ID do convênio.
 * @returns Promise com a resposta da API.
 */
export const deletarConvenio = (id: number) => {
    return crudService.deletar(`${URL_CONVENIO}/${id}`);
};

/**
 * Obtém um convênio por ID.
 * @param id ID do convênio.
 * @returns Promise com os dados do convênio.
 */
export const obterConvenioPorId = async (id: string) => {
    const endpoint = `${URL_CONVENIO}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch convenio with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching convenio:", error);
        throw error;
    }
}

/**
 * Busca todos os convênios.
 * @returns Promise com a lista de convênios.
 */
export const obterTodosConvenios = () => {
    return crudService.ler(URL_CONVENIO);
};
