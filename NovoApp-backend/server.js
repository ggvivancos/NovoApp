const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Importe as rotas
const anestesistasRoute = require('./routes/anestesistas');
const hospitaisRoute = require('./routes/hospitais');
const cirurgioesRoute = require('./routes/cirurgioes');
const cirurgiasRoute = require('./routes/cirurgias');
const procedimentosRoute = require('./routes/procedimentos');
const setorRoutes = require('./routes/setor');
const GrupoDeAnestesiaRoutes = require('./routes/GrupoDeAnestesia');
const saladecirurgiaRoutes = require('./routes/saladecirurgia');
const pacientesRoute = require('./routes/pacientes');





app.use(cors());
app.use(express.json());

// Adicione as rotas ao aplicativo
app.use('/api/anestesistas', anestesistasRoute);
app.use('/api/hospitais', hospitaisRoute);
app.use('/api/cirurgioes', cirurgioesRoute);
app.use('/api/cirurgias', cirurgiasRoute);
app.use('/api/procedimentos', procedimentosRoute);
app.use('/api/setor', setorRoutes);
app.use('/api/GrupoDeAnestesia', GrupoDeAnestesiaRoutes);
app.use('/api/saladecirurgia', saladecirurgiaRoutes);
app.use('/api/pacientes', pacientesRoute);



app.get('/', (req, res) => {
    res.send('API Funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

