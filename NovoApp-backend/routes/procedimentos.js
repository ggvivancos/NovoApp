const express = require('express');
const router = express.Router();
const { Procedimento } = require('../models');

// Listar todos os procedimentos
router.get('/', async (req, res) => {
    try {
        const procedimentos = await Procedimento.findAll();
        res.json(procedimentos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar um novo procedimento
router.post('/', async (req, res) => {
    try {
        const procedimento = await Procedimento.create(req.body);
        res.json(procedimento);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar um procedimento por ID
router.put('/:id', async (req, res) => {
    try {
        await Procedimento.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ success: "Procedimento atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir um procedimento por ID
router.delete('/:id', async (req, res) => {
    try {
        await Procedimento.destroy({
            where: { id: req.params.id }
        });
        res.json({ success: "Procedimento excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
