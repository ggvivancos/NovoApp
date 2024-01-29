import {
    AgendamentoData, CirurgiaoData, ProcedimentoData, HospitalData, StatusData, 
    PacienteData, ConvenioData, GrupoDeAnestesiaData, AnestesistaData, 
    RecursoComplementarData, PacienteProvisorioData
} from './'; // Ajuste o caminho conforme necessário

export interface DadosAgendamentoApi {
    id: number;
    datadacirurgia: string;
    horainicio: string;
    duracao: string;
    Hospital?: HospitalData;
    caraterprocedimento?: string;
    tipoprocedimento?: string;
    Status?: StatusData;
    Cirurgiaos?: CirurgiaoData[];
    Paciente?: PacienteData;
    PacienteProvisorio?: PacienteProvisorioData; // Adicione esta linha
    statusPaciente?: 'Definitivo' | 'Provisório'; // Adicione esta linha
    Procedimentos?: ProcedimentoData[];
    lateralidade: string;
    Convenios?: ConvenioData[];
    GrupoDeAnestesium?: GrupoDeAnestesiaData;
    Anestesistum?: AnestesistaData;
    utiPedida: boolean;
    utiConfirmada: boolean;
    hemoderivadosPedido: boolean;
    hemoderivadosConfirmado: boolean;
    apa: boolean;
    RecursosComplementares?: RecursoComplementarData[];
    // Adicione outros campos conforme necessário
}
