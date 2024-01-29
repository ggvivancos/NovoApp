import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_PACIENTE_PROVISORIO = '/pacientesprovisorios';

// Defina uma interface para o tipo de dados dos pacientes provisórios
interface PacienteProvisorioData {
    nomecompleto: string;
    datadenascimento?: string;
    CPF?: string;
    telefone?: string;
    observacao?: string;
    VAD?: boolean;
    alergia?: boolean;
    alergiaLatex?: boolean;
}

/**
 * Cria um novo paciente provisório.
 * @param data Dados do paciente provisório.
 * @returns Promise com a resposta da API.
 */
export const criarPacienteProvisorio = (data: PacienteProvisorioData) => {
    return crudService.criar(URL_PACIENTE_PROVISORIO, data);
};

/**
 * Busca todos os pacientes provisórios.
 * @returns Promise com a lista de pacientes provisórios.
 */
export const obterPacientesProvisorios = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_PACIENTE_PROVISORIO}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um paciente provisório existente.
 * @param id ID do paciente provisório.
 * @param data Dados atualizados do paciente provisório.
 * @returns Promise com a resposta da API.
 */
export const atualizarPacienteProvisorio = (id: number, data: PacienteProvisorioData) => {
    return crudService.atualizar(`${URL_PACIENTE_PROVISORIO}/${id}`, data);
};

/**
 * Deleta um paciente provisório.
 * @param id ID do paciente provisório.
 * @returns Promise com a resposta da API.
 */
export const deletarPacienteProvisorio = (id: number) => {
    return crudService.deletar(`${URL_PACIENTE_PROVISORIO}/${id}`);
};

export const obterPacienteProvisorioPorId = async (id: string) => {
    const endpoint = `${URL_PACIENTE_PROVISORIO}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch paciente provisório with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching paciente provisório:", error);
        throw error;
    }
}

export const obterTodosPacientesProvisorios = () => {
    return crudService.ler(`${URL_PACIENTE_PROVISORIO}?all=true`);
};
