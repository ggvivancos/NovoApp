import * as crudService from './crudservice';

const URL_GRUPO_ANESTESIA = '/grupodeanestesia';

export const obterTodosGruposDeAnestesia = () => {
    return crudService.ler(URL_GRUPO_ANESTESIA);
};

export const obterGrupoDeAnestesiaPorId = (id: number) => {
    return crudService.ler(`${URL_GRUPO_ANESTESIA}/${id}`);
};

export const criarGrupoDeAnestesia = (data: { nome: string, nomeabreviado: string }) => {
    return crudService.criar(URL_GRUPO_ANESTESIA, data);
};

export const atualizarGrupoDeAnestesia = (id: number, data: { nome?: string, nomeabreviado?: string }) => {
    return crudService.atualizar(`${URL_GRUPO_ANESTESIA}/${id}`, data);
};

export const deletarGrupoDeAnestesia = (id: number) => {
    return crudService.deletar(`${URL_GRUPO_ANESTESIA}/${id}`);
};
