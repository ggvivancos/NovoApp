const BASE_URL = 'http://10.0.2.2:5000/api';

export const criar = async (url: string, data: any) => {
    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json(); // Adicionado para converter a resposta em JSON
};

export const ler = async (url: string) => {
    const response = await fetch(`${BASE_URL}${url}`);
    return response.json(); // Adicionado para converter a resposta em JSON
};

export const atualizar = async (url: string, data: any) => {
    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json(); // Adicionado para converter a resposta em JSON
};

export const deletar = (url: string) => {
    return fetch(`${BASE_URL}${url}`, {
        method: 'DELETE',
    });
};
