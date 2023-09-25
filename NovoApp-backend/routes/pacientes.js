const express = require('express');
const router = express.Router();
const { Paciente } = require('../models');

// Listar todos os pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();
        res.json(pacientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar um novo paciente
router.post('/', async (req, res) => {
    try {
        const paciente = await Paciente.create(req.body);
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar um paciente por ID
router.put('/:id', async (req, res) => {
    try {
        await Paciente.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ success: "Paciente atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir um paciente por ID
router.delete('/:id', async (req, res) => {
    try {
        await Paciente.destroy({
            where: { id: req.params.id }
        });
        res.json({ success: "Paciente excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
