export interface Procedimento {
    data: Date;
    horaInicio: string; // formato "HH:mm"
    duracao: number; // em horas
    hospital: string;
    setor: string;
    cirurgiao: string;
    cirurgia: string;
    cor: string;
    posicaoAnestesista: number; // Novo campo para representar a linha no gráfico
}

const ProcedimentosAgendados: Procedimento[] = [
    {
        data: new Date(2023, 7, 31), // 25 de Agosto de 2023
        horaInicio: '08:00',
        duracao: 2, // 2 horas
        hospital: 'Hospital A',
        setor: 'Cardiologia',
        cirurgiao: 'Dr. João Silva',
        cirurgia: 'Bypass',
        cor: '#FF8888',
        posicaoAnestesista: 1,
    },
    {
        data: new Date(2023, 7, 31), // mesmo dia, diferente hora
        horaInicio: '06:00',
        duracao: 1.5, // 1.5 horas
        hospital: 'Hospital B',
        setor: 'Ortopedia',
        cirurgiao: 'Dra. Maria Costa',
        cirurgia: 'Artroscopia',
        cor: '#88FF88',
        posicaoAnestesista: 3,
    },   
    {
    data: new Date(2023, 7, 31),
    horaInicio: '11:00',
    duracao: 2.5,
    hospital: 'Hospital C',
    setor: 'Neurologia',
    cirurgiao: 'Dr. Felipe Santos',
    cirurgia: 'Craniotomia',
    cor: '#8888FF',
    posicaoAnestesista: 5,
},
{
    data: new Date(2023, 7, 30),
    horaInicio: '10:15',
    duracao: 1,
    hospital: 'Hospital A',
    setor: 'Urologia',
    cirurgiao: 'Dra. Clara Fernandes',
    cirurgia: 'Nefrectomia',
    cor: '#FFFF88',
    posicaoAnestesista: 7,
},
{
    data: new Date(2023, 7, 25),
    horaInicio: '17:30',
    duracao: 3,
    hospital: 'Hospital D',
    setor: 'Pediatra',
    cirurgiao: 'Dr. Lucas Alves',
    cirurgia: 'Amigdalectomia',
    cor: '#FF88FF',
    posicaoAnestesista: 2,
},
{
    data: new Date(2023, 7, 25),
    horaInicio: '19:00',
    duracao: 1.5,
    hospital: 'Hospital B',
    setor: 'Ortopedia',
    cirurgiao: 'Dra. Camila Ribeiro',
    cirurgia: 'Fratura do fêmur',
    cor: '#88FFFF',
    posicaoAnestesista: 6,
},
{
    data: new Date(2023, 7, 25),
    horaInicio: '21:00',
    duracao: 2,
    hospital: 'Hospital E',
    setor: 'Dermatologia',
    cirurgiao: 'Dr. Roberto Pereira',
    cirurgia: 'Excisão de melanoma',
    cor: '#FFDD88',
    posicaoAnestesista: 4,
},
{
    data: new Date(2023, 7, 26),
    horaInicio: '08:30',
    duracao: 2,
    hospital: 'Hospital F',
    setor: 'Ginecologia',
    cirurgiao: 'Dra. Beatriz Mendonça',
    cirurgia: 'Histerectomia',
    cor: '#DD88FF',
    posicaoAnestesista: 8,
},
{
    data: new Date(2023, 7, 26),
    horaInicio: '10:45',
    duracao: 1.5,
    hospital: 'Hospital G',
    setor: 'Cardiologia',
    cirurgiao: 'Dr. Marcelo Guerra',
    cirurgia: 'Angioplastia',
    cor: '#88DDFF',
    posicaoAnestesista: 9,
},
{
    data: new Date(2023, 7, 26),
    horaInicio: '13:15',
    duracao: 2.5,
    hospital: 'Hospital A',
    setor: 'Endocrinologia',
    cirurgiao: 'Dra. Julia Lima',
    cirurgia: 'Tireoidectomia',
    cor: '#FFBB88',
    posicaoAnestesista: 10,
},
{
    data: new Date(2023, 7, 26),
    horaInicio: '15:00',
    duracao: 1,
    hospital: 'Hospital B',
    setor: 'Oftalmologia',
    cirurgiao: 'Dr. Rodrigo Freitas',
    cirurgia: 'Catarata',
    cor: '#BB88FF',
    posicaoAnestesista: 11,
},
{
    data: new Date(2023, 7, 26),
    horaInicio: '16:15',
    duracao: 3,
    hospital: 'Hospital C',
    setor: 'Traumatologia',
    cirurgiao: 'Dra. Larissa Faria',
    cirurgia: 'Descompressão medular',
    cor: '#88BBFF',
    posicaoAnestesista: 12,
},
{
    data: new Date(2023, 7, 27),
    horaInicio: '08:00',
    duracao: 2,
    hospital: 'Hospital D',
    setor: 'Oncologia',
    cirurgiao: 'Dr. Rafael Martins',
    cirurgia: 'Mastectomia',
    cor: '#FFAA88',
    posicaoAnestesista: 3,
},
{
    data: new Date(2023, 7, 27),
    horaInicio: '10:30',
    duracao: 1.5,
    hospital: 'Hospital E',
    setor: 'Gastroenterologia',
    cirurgiao: 'Dra. Bruna Vieira',
    cirurgia: 'Gastrectomia',
    cor: '#AA88',
    posicaoAnestesista: 2,
},
];





export default ProcedimentosAgendados;
