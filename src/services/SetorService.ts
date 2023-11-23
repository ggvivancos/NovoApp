import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';

const URL_SETOR = '/setores';

export const criarSetor = (data: any) => {
    return crudService.criar(URL_SETOR, data);
};

export const obterSetores = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_SETOR}?limit=${limit}&page=${page}`);
};

export const atualizarSetor = (id: number, data: any) => {
    return crudService.atualizar(`${URL_SETOR}/${id}`, data);
};

export const deletarSetor = (id: number) => {
    return crudService.deletar(`${URL_SETOR}/${id}`);
};

export const obterSetorPorId = async (id: string) => {
    const endpoint = `${URL_SETOR}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch setor with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching setor:", error);
        throw error;
    }
};

export const obterSetoresPorHospital = async (hospitalId: string) => {
    const endpoint = `/hospitais/${hospitalId}/setores`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch setores for hospital with ID ${hospitalId}`);
        }
        const data = await response.json();
        const setoresNaoDeletados = data.filter((setor: any) => !setor.isDeleted);
        return setoresNaoDeletados;
    } catch (error) {
        console.error("Error fetching setores for hospital:", error);
        throw error;
    }
};




export const obterTodosSetores = () => {
    return crudService.ler(URL_SETOR);
};
