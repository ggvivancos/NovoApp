const express = require('express');
const router = express.Router();
const { Cirurgia } = require('../models');

// Listar todas as cirurgias
router.get('/', async (req, res) => {
    try {
        const cirurgias = await Cirurgia.findAll();
        res.json(cirurgias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar uma nova cirurgia
router.post('/', async (req, res) => {
    try {
        const cirurgia = await Cirurgia.create(req.body);
        res.json(cirurgia);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar uma cirurgia por ID
router.put('/:id', async (req, res) => {
    try {
        await Cirurgia.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ success: "Cirurgia atualizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir uma cirurgia por ID
router.delete('/:id', async (req, res) => {
    try {
        await Cirurgia.destroy({
            where: { id: req.params.id }
        });
        res.json({ success: "Cirurgia excluída com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
