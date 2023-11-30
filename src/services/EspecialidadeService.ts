import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_ESPECIALIDADE = '/especialidades';

// Tipagem para os dados da especialidade
interface EspecialidadeData {
    nome: string;
    nomeabreviado: string;
    cor?: string; // A coluna 'cor' é opcional
}

/**
 * Cria uma nova especialidade.
 * @param data Dados da especialidade.
 * @returns Promise com a resposta da API.
 */
export const criarEspecialidade = (data: EspecialidadeData) => {
    // Aqui você pode adicionar validações para os dados, se necessário
    return crudService.criar(URL_ESPECIALIDADE, data);
};

/**
 * Busca todas as especialidades.
 * @returns Promise com a lista de especialidades.
 */
export const obterEspecialidades = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_ESPECIALIDADE}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza uma especialidade existente.
 * @param id ID da especialidade.
 * @param data Dados atualizados da especialidade.
 * @returns Promise com a resposta da API.
 */
export const atualizarEspecialidade = (id: number, data: EspecialidadeData) => {
    // Aqui você pode adicionar validações para os dados, se necessário
    return crudService.atualizar(`${URL_ESPECIALIDADE}/${id}`, data);
};

/**
 * Deleta uma especialidade.
 * @param id ID da especialidade.
 * @returns Promise com a resposta da API.
 */
export const deletarEspecialidade = (id: number) => {
    return crudService.deletar(`${URL_ESPECIALIDADE}/${id}`);
};

export const obterEspecialidadePorId = async (id: string) => {
    const endpoint = `${URL_ESPECIALIDADE}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch especialidade with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching especialidade:", error);
        throw error;
    }
}

export const obterTodasEspecialidades = () => {
    return crudService.ler(URL_ESPECIALIDADE);
};
