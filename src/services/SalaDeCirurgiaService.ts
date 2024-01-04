import * as crudService from './crudservice';

const BASE_URL = 'http://10.0.2.2:5000/api';

const URL_SALA = '/saladecirurgia';

export const criarSalaDeCirurgia = (data: any) => {
    return crudService.criar(URL_SALA, data);
};

export const obterSalasDeCirurgia = (limit: number = 25, page: number = 1) => {
    return crudService.ler(`${URL_SALA}?limit=${limit}&page=${page}`);
};

export const atualizarSalaDeCirurgia = (id: number, data: any) => {
    return crudService.atualizar(`${URL_SALA}/${id}`, data);
};

export const deletarSalaDeCirurgia = (id: number) => {
    return crudService.deletar(`${URL_SALA}/${id}`);
};

export const obterSalaDeCirurgiaPorId = async (id: string) => {
    const endpoint = `${URL_SALA}/${id}`;

    try {
        const response = await fetch(BASE_URL + endpoint);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch sala de cirurgia with ID ${id}`);
        }
        const data = await response.json();
        console.log("Dados retornados do serviço para ID", id, ":", data);
        return data;
    } catch (error) {
        console.error("Error fetching sala de cirurgia:", error);
        throw error;
    }
};

export const obterSalasDeCirurgiaPorSetor = async (setorId: string) => {
    const endpoint = `/setores/${setorId}/saladecirurgia`;
    try {
        const response = await fetch(BASE_URL + endpoint);
        const data = await response.json();
        console.log("Resposta da API para obterSalasDeCirurgiaPorSetor:", data);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch salas de cirurgia for setor with ID ${setorId}`);
        }
        const salasNaoDeletadas = data.filter((sala: any) => !sala.isDeleted);
        return salasNaoDeletadas;
    } catch (error) {
        console.error("Error fetching salas de cirurgia for setor:", error);
        throw error;
    }
};


export const obterTodasSalasDeCirurgia = () => {
    return crudService.ler(`${URL_SALA}?all=true`);
};
