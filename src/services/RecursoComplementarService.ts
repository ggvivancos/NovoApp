import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_RECURSO_COMPLEMENTAR = '/recursosComplementares';

// Tipagem para os dados do recurso complementar
interface RecursoComplementarData {
    recurso: string;
    descricao?: string;
    quantidadeDisponivel: number;
}

/**
 * Cria um novo recurso complementar.
 * @param data Dados do recurso complementar.
 * @returns Promise com a resposta da API.
 */
export const criarRecursoComplementar = (data: RecursoComplementarData) => {
    return crudService.criar(URL_RECURSO_COMPLEMENTAR, data);
};

/**
 * Busca todos os recursos complementares.
 * @returns Promise com a lista de recursos complementares.
 */
export const obterRecursosComplementares = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_RECURSO_COMPLEMENTAR}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um recurso complementar existente.
 * @param id ID do recurso complementar.
 * @param data Dados atualizados do recurso complementar.
 * @returns Promise com a resposta da API.
 */
export const atualizarRecursoComplementar = (id: number, data: RecursoComplementarData) => {
    return crudService.atualizar(`${URL_RECURSO_COMPLEMENTAR}/${id}`, data);
};

/**
 * Deleta um recurso complementar.
 * @param id ID do recurso complementar.
 * @returns Promise com a resposta da API.
 */
export const deletarRecursoComplementar = (id: number) => {
    return crudService.deletar(`${URL_RECURSO_COMPLEMENTAR}/${id}`);
};

/**
 * Obtém um recurso complementar por ID.
 * @param id ID do recurso complementar.
 * @returns Promise com os dados do recurso complementar.
 */
export const obterRecursoComplementarPorId = async (id: string) => {
    const endpoint = `${URL_RECURSO_COMPLEMENTAR}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch recurso complementar with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching recurso complementar:", error);
        throw error;
    }
}

/**
 * Busca todos os recursos complementares.
 * @returns Promise com a lista de recursos complementares.
 */
export const obterTodosRecursosComplementares = () => {
    return crudService.ler(`${URL_RECURSO_COMPLEMENTAR}?all=true`);
};
