import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_FORNECEDOR = '/fornecedores';

// Tipagem para os dados do fornecedor
interface FornecedorData {
    nome: string;
    telefone?: string;
    representante?: string;
    descricao?: string;
}

/**
 * Cria um novo fornecedor.
 * @param data Dados do fornecedor.
 * @returns Promise com a resposta da API.
 */
export const criarFornecedor = (data: FornecedorData) => {
    return crudService.criar(URL_FORNECEDOR, data);
};

/**
 * Busca todos os fornecedores.
 * @returns Promise com a lista de fornecedores.
 */
export const obterFornecedores = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_FORNECEDOR}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um fornecedor existente.
 * @param id ID do fornecedor.
 * @param data Dados atualizados do fornecedor.
 * @returns Promise com a resposta da API.
 */
export const atualizarFornecedor = (id: number, data: FornecedorData) => {
    return crudService.atualizar(`${URL_FORNECEDOR}/${id}`, data);
};

/**
 * Deleta um fornecedor.
 * @param id ID do fornecedor.
 * @returns Promise com a resposta da API.
 */
export const deletarFornecedor = (id: number) => {
    return crudService.deletar(`${URL_FORNECEDOR}/${id}`);
};

/**
 * Obtém um fornecedor por ID.
 * @param id ID do fornecedor.
 * @returns Promise com os dados do fornecedor.
 */
export const obterFornecedorPorId = async (id: string) => {
    const endpoint = `${URL_FORNECEDOR}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch fornecedor with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching fornecedor:", error);
        throw error;
    }
}

/**
 * Busca todos os fornecedores.
 * @returns Promise com a lista de fornecedores.
 */
export const obterTodosFornecedores = () => {
    return crudService.ler(`${URL_FORNECEDOR}?all=true`);
};
