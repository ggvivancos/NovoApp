import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_OPME = '/opme';

// Tipagem para os dados da OPME
interface OPMEData {
    nome: string;
    descricao?: string;
}

/**
 * Cria uma nova OPME.
 * @param data Dados da OPME.
 * @returns Promise com a resposta da API.
 */
export const criarOPME = (data: OPMEData) => {
    return crudService.criar(URL_OPME, data);
};

/**
 * Busca todas as OPMEs.
 * @returns Promise com a lista de OPMEs.
 */
export const obterOPMEs = (limit = 25, page = 1) => {
    return crudService.ler(`${URL_OPME}?limit=${limit}&page=${page}`)
        .then(response => {
            console.log("Dados recebidos do serviço:", response);
            return response;
        });
};

/**
 * Atualiza uma OPME existente.
 * @param id ID da OPME.
 * @param data Dados atualizados da OPME.
 * @returns Promise com a resposta da API.
 */
export const atualizarOPME = (id: number, data: OPMEData) => {
    return crudService.atualizar(`${URL_OPME}/${id}`, data);
};

/**
 * Deleta uma OPME.
 * @param id ID da OPME.
 * @returns Promise com a resposta da API.
 */
export const deletarOPME = (id: number) => {
    return crudService.deletar(`${URL_OPME}/${id}`);
};

/**
 * Obtém uma OPME por ID.
 * @param id ID da OPME.
 * @returns Promise com os dados da OPME.
 */
export const obterOPMEPorId = async (id: string) => {
    const endpoint = `${URL_OPME}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch OPME with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Error fetching OPME:", error);
        throw error;
    }
}

/**
 * Busca todas as OPMEs.
 * @returns Promise com a lista de OPMEs.
 */
export const obterTodasOPMEs = () => {
    return crudService.ler(`${URL_OPME}?all=true`);
};
