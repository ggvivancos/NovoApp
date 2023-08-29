export type Procedimento = {
    id: string;
    anestesistaId: number;
    hospital: string;
    setor: string;
    cirurgiao: string;
    cirurgia: string;
    horainicio: number;
    duracao: number;
};

export const ProcedimentosdoDia: Procedimento[] = [
    {
        id: '1',
        anestesistaId: 1,
        hospital: 'SÃO LUCAS',
        setor: 'Setor A',
        cirurgiao: 'Dr. João',
        cirurgia: 'Cirurgia Cardíaca',
        horainicio: 9,
        duracao: 3
    },
    {
        id: '2',
        anestesistaId: 2,
        hospital: 'UNIMED',
        setor: 'Setor B',
        cirurgiao: 'Dra. Maria',
        cirurgia: 'Cirurgia Ortopédica',
        horainicio: 9,
        duracao: 2
    },
    {
        id: '3',
        anestesistaId: 3,
        hospital: 'HORP',
        setor: 'Setor C',
        cirurgiao: 'Dr. Pedro',
        cirurgia: 'Cirurgia Geral',
        horainicio: 9,
        duracao: 4
    },
    {
        id: '4',
        anestesistaId: 4,
        hospital: 'COE',
        setor: 'Setor D',
        cirurgiao: 'Dra. Fernanda',
        cirurgia: 'Cirurgia Oftalmológica',
        horainicio: 9,
        duracao: 2
    },
    {
        id: '5',
        anestesistaId: 5,
        hospital: 'SÃO LUCAS',
        setor: 'Setor E',
        cirurgiao: 'Dr. Roberto',
        cirurgia: 'Cirurgia Plástica',
        horainicio: 9,
        duracao: 3
    },
    {
        id: '6',
        anestesistaId: 6,
        hospital: 'UNIMED',
        setor: 'Setor F',
        cirurgiao: 'Dra. Juliana',
        cirurgia: 'Cirurgia Vascular',
        horainicio: 9,
        duracao: 2
    },
    {
        id: '7',
        anestesistaId: 7,
        hospital: 'HORP',
        setor: 'Setor G',
        cirurgiao: 'Dr. Lucas',
        cirurgia: 'Cirurgia Urológica',
        horainicio: 9,
        duracao: 3
    },
    {
        id: '8',
        anestesistaId: 8,
        hospital: 'COE',
        setor: 'Setor H',
        cirurgiao: 'Dra. Paula',
        cirurgia: 'Cirurgia de Cabeça e Pescoço',
        horainicio: 9,
        duracao: 2
    },
    {
        id: '9',
        anestesistaId: 9,
        hospital: 'SÃO LUCAS',
        setor: 'Setor I',
        cirurgiao: 'Dr. Guilherme',
        cirurgia: 'Cirurgia Pediátrica',
        horainicio: 9,
        duracao: 3
    },
    {
        id: '10',
        anestesistaId: 10,
        hospital: 'UNIMED',
        setor: 'Setor J',
        cirurgiao: 'Dra. Beatriz',
        cirurgia: 'Cirurgia Ginecológica',
        horainicio: 9,
        duracao: 2
    },
    {
        id: '11',
        anestesistaId: 5,
        hospital: 'SÃO LUCAS',
        setor: 'Setor E',
        cirurgiao: 'Dr. Roberto',
        cirurgia: 'Cirurgia Plástica',
        horainicio: 9,
        duracao: 3
    },
    {
        id: '12',
        anestesistaId: 6,
        hospital: 'UNIMED',
        setor: 'Setor F',
        cirurgiao: 'Dra. Juliana',
        cirurgia: 'Cirurgia Vascular',
        horainicio: 9,
        duracao: 2
    },
    {
        id: '13',
        anestesistaId: 7,
        hospital: 'HORP',
        setor: 'Setor G',
        cirurgiao: 'Dr. Lucas',
        cirurgia: 'Cirurgia Urológica',
        horainicio: 9,
        duracao: 3
    },
    {
        id: '14',
        anestesistaId: 8,
        hospital: 'COE',
        setor: 'Setor H',
        cirurgiao: 'Dra. Paula',
        cirurgia: 'Cirurgia de Cabeça e Pescoço',
        horainicio: 9,
        duracao: 2
    },
    {
        id: '15',
        anestesistaId: 9,
        hospital: 'SÃO LUCAS',
        setor: 'Setor I',
        cirurgiao: 'Dr. Guilherme',
        cirurgia: 'Cirurgia Pediátrica',
        horainicio: 9,
        duracao: 3
    },
    {
        id: '16',
        anestesistaId: 10,
        hospital: 'UNIMED',
        setor: 'Setor J',
        cirurgiao: 'Dra. Beatriz',
        cirurgia: 'Cirurgia Ginecológica',
        horainicio: 9,
        duracao: 2
    }
];

export default ProcedimentosdoDia;