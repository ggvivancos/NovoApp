import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';
const URL_PACIENTE = '/pacientes';

// Defina uma interface para o tipo de dados dos pacientes
interface PacienteData {
    nomecompleto: string;
    datadenascimento: string;
    CPF: string;
    telefone: string;
    observacao: string;
    VAD: boolean;
    alergia: boolean;
    alergiaLatex: boolean;
}

/**
 * Cria um novo paciente.
 * @param data Dados do paciente.
 * @returns Promise com a resposta da API.
 */
export const criarPaciente = (data: PacienteData) => {
    return crudService.criar(URL_PACIENTE, data);
};

/**
 * Busca todos os pacientes.
 * @returns Promise com a lista de pacientes.
 */
export const obterPacientes = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_PACIENTE}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um paciente existente.
 * @param id ID do paciente.
 * @param data Dados atualizados do paciente.
 * @returns Promise com a resposta da API.
 */
export const atualizarPaciente = (id: number, data: PacienteData) => {
    return crudService.atualizar(`${URL_PACIENTE}/${id}`, data);
};

/**
 * Deleta um paciente.
 * @param id ID do paciente.
 * @returns Promise com a resposta da API.
 */
export const deletarPaciente = (id: number) => {
    return crudService.deletar(`${URL_PACIENTE}/${id}`);
};

export const obterPacientePorId = async (id: string) => {
    const endpoint = `${URL_PACIENTE}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch paciente with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching paciente:", error);
        throw error;
    }
}

export const obterTodosPacientes = () => {
    return crudService.ler(`${URL_PACIENTE}?all=true`);
};
