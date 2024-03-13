import { AgendamentoData } from './AgendamentoData';
import { CirurgiaoData } from './CirurgiaoData';
import { ProcedimentoData } from './ProcedimentoData';
import { HospitalData } from './HospitalData';
import { StatusData } from './StatusData';
import { PacienteData } from './PacienteData';
import { ConvenioData } from './ConvenioData';
import { GrupoDeAnestesiaData } from './GrupoDeAnestesiaData';
import { AnestesistaData } from './AnestesistaData';
import { RecursoComplementarData } from './RecursoComplementarData';
import { PacienteProvisorioData } from './PacienteProvisorioData';
import { OPMEData } from './OPMEData';
import { FornecedorData } from './FornecedorData';
import { FioAgendamentoData } from './FioAgendamentoData';
import { InstrumentalData } from './InstrumentalData';
import { SalaDeCirurgiaData } from './SalaDeCirurgiaData';
import { SetorData } from './SetorData';
import { FioData } from './FioData';





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
    recursocomplementars?: RecursoComplementarData[];
    OPMEs?: OPMEData[]; // Nova propriedade para representar as OPMEs do agendamento
    Fornecedors?: FornecedorData[];
    Fios?: FioAgendamentoData[];
    Instrumentals?: InstrumentalData[];
    createdAt: string;
    updatedAt: string;
    leito: string;
    aviso: string;
    pacote: boolean;
    prontuario: string;
    tipoDeAcomodacao: string;
    mudancaDeAcomodacao: boolean;
    observacoes: string;
    SaladeCirurgia?: SalaDeCirurgiaData; // Corrigindo o nome conforme a nomenclatura do TypeScript
    Setor?: SetorData;
    matricula: string;
    // Adicione outros campos conforme necessário
}
