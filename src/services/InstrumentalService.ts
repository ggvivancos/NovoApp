import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_INSTRUMENTAL = '/instrumentais'; // Alterado

// Tipagem para os dados do instrumental
interface InstrumentalData {
    nome: string; // Alterado
    descricao?: string;
    quantidadeDisponivel: number;
}

// Cria um novo instrumental
export const criarInstrumental = (data: InstrumentalData) => {
    return crudService.criar(URL_INSTRUMENTAL, data);
};

// Busca todos os instrumentais
export const obterInstrumentais = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_INSTRUMENTAL}?limit=${limit}&page=${page}`);
};

// Atualiza um instrumental existente
export const atualizarInstrumental = (id: number, data: InstrumentalData) => {
    return crudService.atualizar(`${URL_INSTRUMENTAL}/${id}`, data);
};

// Deleta um instrumental
export const deletarInstrumental = (id: number) => {
    return crudService.deletar(`${URL_INSTRUMENTAL}/${id}`);
};

// Obtém um instrumental por ID
export const obterInstrumentalPorId = async (id: string) => {
    const endpoint = `${URL_INSTRUMENTAL}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch instrumental with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching instrumental:", error);
        throw error;
    }
}

// Busca todos os instrumentais
export const obterTodosInstrumentais = () => {
    return crudService.ler(`${URL_INSTRUMENTAL}?all=true`);
};
