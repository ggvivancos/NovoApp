import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';

const URL_HOSPITAL = '/hospitais';

/**
 * Cria um novo hospital.
 * @param data Dados do hospital.
 * @returns Promise com a resposta da API.
 */
export const criarHospital = (data: any) => {
    return crudService.criar(URL_HOSPITAL, data);
};

/**
 * Busca todos os hospitais.
 * @returns Promise com a lista de hospitais.
 */
export const obterHospitais = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_HOSPITAL}?limit=${limit}&page=${page}`);
};

/**
 * Atualiza um hospital existente.
 * @param id ID do hospital.
 * @param data Dados atualizados do hospital.
 * @returns Promise com a resposta da API.
 */
export const atualizarHospital = (id: number, data: any) => {
    return crudService.atualizar(`${URL_HOSPITAL}/${id}`, data);
};

/**
 * Deleta um hospital.
 * @param id ID do hospital.
 * @returns Promise com a resposta da API.
 */
export const deletarHospital = (id: number) => {
    return crudService.deletar(`${URL_HOSPITAL}/${id}`);
};

/**
 * Busca um hospital pelo ID.
 * @param id ID do hospital.
 * @returns Dados do hospital.
 */
export const obterHospitalPorId = async (id: string) => {
    const endpoint = `${URL_HOSPITAL}/${id}/nome`;  // Adicione /nome aqui

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch hospital with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching hospital:", error);
        throw error;
    }
}
