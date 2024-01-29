export type Paciente = {
    id: number;
    nomecompleto: string;
    datadenascimento: string;
    idade: number;
    VAD: boolean;
    alergia: boolean;
    alergiaLatex: boolean;
    prontuario: string;
    CPF: string;
    RG: string;
    telefone: string;
    observacao: string;
    createdAt: string;
    updatedAt: string;
};



    export interface DadosEtapa1 {
        dataSelecionada: string;
        horarioInicio: string;
        duracao: string;
        cirurgioesSelecionados: number[];
        statusId: number;
        hospitalId: number; // Novo campo
        setorId: number | null; // Novo campo
        salaDeCirurgiaId: number | null; // Novo campo
        caraterprocedimento?: string; // Campo opcional
        tipoprocedimento?: string; // Campo opcional
}
    
    
export interface DadosEtapa2 {
    pacienteId?: number;
    pacienteProvisorioId?: number;
    statusPaciente: 'Definitivo' | 'Provisório' | undefined;    // ... outros campos
}
    
    export interface DadosEtapa3 {
        procedimentosSelecionados: number[];
        conveniosSelecionados: number[];
        lateralidade: string;
        planoId: number | null;
        matricula: string;
        // Outros campos da Etapa 3, se necessário
    }
    
    export interface DadosEtapa4 {
        utiPedida: boolean;
        utiConfirmada: boolean;
        hemoderivadosPedido: boolean;
        hemoderivadosConfirmado: boolean;
        apa: boolean;
        leito: string;
        aviso: string;
        prontuario: string;
        pacote: boolean;
        grupoDeAnestesiaSelecionado: number | null;
        anestesistaSelecionado: number | null;
        // Outros campos da Etapa 4, se necessário
    }
    
    export interface DadosEtapa5 {
        materiaisEspeciais: number[];
       opmesSelecionadas: number[];
        fornecedoresSelecionados: number[];
        // Outros campos da Etapa 5, se necessário
    }