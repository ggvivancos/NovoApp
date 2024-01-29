import {
    AnestesistaData, HospitalData, SetorData, GrupoDeAnestesiaData, 
    SalaDeCirurgiaData, PacienteData, PacienteProvisorioData, ProcedimentoData, CirurgiaoData, 
    ConvenioData, StatusData, OPMEData, FornecedorData, 
    RecursoComplementarData, InstrumentalData
} from './';

export interface AgendamentoData {
    //index
    cirurgioesNomes?: string[];
    procedimentosNomes?: string[];
    statusNome?: string;
    statusCor?: string;

    // Etapa 1
    id?: number; // Opcional para criação, necessário para atualização
    datadacirurgia: string;
    horainicio: string;
    duracao: string;
    hospitalId: number;
    setorId?: number; // ID do setor
    caraterprocedimento?: string; // Novo campo, opcional
    tipoprocedimento?: string; // Novo campo, opcional
    statusId: number;
    cirurgioesId: number[]; // Array de IDs dos cirurgiões
    SaladeCirurgiaId?: number; // ID da Sala de Cirurgia

    // Etapa 2
    pacienteId?: number; // ID do paciente definitivo
    pacienteProvisorioId?: number; // ID do paciente provisório
    statusPaciente: 'Definitivo' | 'Provisório'; // Status do paciente no agendamento
    pacienteNome?: string; // Nome do paciente (opcional)
    pacienteDados?: PacienteData; // Dados completos do paciente (opcional)

    // Etapa 3
    procedimentosId: number[]; // Array de IDs dos procedimentos
    lateralidade: string;
    conveniosId: number[]; // Array de IDs dos convênios
    matricula?: string; // Opcional, array de matrículas

    // Etapa 4
    grupodeanestesiaId?: number | null;
    anestesistaId?: number | null;

    utiPedida: boolean;
    utiConfirmada: boolean;
    hemoderivadosPedido: boolean;
    hemoderivadosConfirmado: boolean;
    apa: boolean;
    leito?: string; // Campo para leito
    aviso?: string; // Campo para aviso
    prontuario?: string; // Campo para prontuário
    pacote?: boolean; // Campo para pacote

    // Etapa 5 (se houver)
    recursosComplementaresId?: number[]; // IDs dos recursos complementares
    opmeId?: number[]; // IDs de OPMEs
    fornecedoresId?: number[]; // IDs dos fornecedores

    // Outros campos conforme necessário
    observacoes?: string; // Campo para observações adicionais
}
