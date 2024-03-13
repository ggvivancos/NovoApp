export interface Anestesista {
    id: number;
    nomecompleto: string;
  }
  
  export interface Hospital {
    id: number;
    nome: string;
  }
  
  export interface Setor {
    id: number;
    nome: string;
  }
  
  export interface GrupoDeAnestesia {
    id: number;
    nome: string;
  }
  
  export interface SalaDeCirurgia {
    id: number;
    nome: string;
  }
  
  export interface Paciente {
    id: number;
    nomecompleto: string;
    datadenascimento: string;
    observacao: string;
    VAD: boolean;
    alergia: boolean;
    alergiaLatex: boolean;
  }
  
  export interface PacienteProvisorio {
    id: number;
    nomecompleto: string;
    datadenascimento: string;
    observacao: string;
    VAD: boolean;
    alergia: boolean;
    alergiaLatex: boolean;
  }
  
  export interface Procedimento {
    id: number;
    nome: string;
    codigoTUSS: string;
  }
  
  export interface Cirurgiao {
    id: number;
    nome: string;
  }
  
  export interface Convenio {
    id: number;
    nome: string;
  }
  
  export interface Status {
    id: number;
    nome: string;
    cor: string;
  }
  
  export interface OPME {
    id: number;
    nome: string;
  }
  
  export interface Fornecedor {
    id: number;
    nome: string;
  }
  
  export interface RecursoComplementar {
    id: number;
    recurso: string;
  }
  
  export interface Fio {
    id: number;
    nome: string;
    quantidadeNecessaria?: number; // Adicionado como opcional, pois pode ser que esteja definido na tabela de join
  }
  
  export interface Instrumental {
    id: number;
    nome: string;
  }
  
  export interface DetalhesAgendamento {
    Anestesistum?: Anestesista;
    Hospital?: Hospital;
    Setor?: Setor;
    GrupoDeAnestesium?: GrupoDeAnestesia;
    SalaDeCirurgia?: SalaDeCirurgia;
    Paciente?: Paciente;
    PacienteProvisorio?: PacienteProvisorio;
    Procedimentos?: Procedimento[];
    Cirurgiaos?: Cirurgiao[];
    Convenios?: Convenio[];
    Status?: Status;
    OPMEs?: OPME[];
    Fornecedors?: Fornecedor[];
    recursocomplementars?: RecursoComplementar[];
    Fios?: Fio[];
    Instrumentals?: Instrumental[];
    // Adicionando as propriedades faltantes
    datadacirurgia?: string;
    horainicio?: string;
    duracao?: string;
    caraterprocedimento?: string;
    tipoprocedimento?: string;
    lateralidade?: string;
    matricula?: string;
    grupodeanestesiaId?: number | null;
    anestesistaId?: number | null;
    utiPedida?: boolean;
    utiConfirmada?: boolean;
    hemoderivadosPedido?: boolean;
    hemoderivadosConfirmado?: boolean;
    apa?: boolean;
    leito?: string;
    aviso?: string;
    prontuario?: string;
    pacote?: boolean;
    observacoes?: string;
    tipoDeAcomodacao?: string;
    mudancaDeAcomodacao?: boolean;
  }
  

  export interface Fio {
    id: number;
    nome: string;
    quantidadeNecessaria?: number; // Esta propriedade é opcional e indica a quantidade necessária do fio no agendamento
  }
  