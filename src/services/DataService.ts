// services/DataService.ts (ou .js, dependendo da sua configuração)
export const fetchDataPaginated = async (endpoint: string, page = 1, limit = 25) => {
    try {
        const response = await fetch(`${endpoint}?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    } catch (error) {
        console.error("Erro ao buscar dados paginados:", error);
        throw error;
    }
};
