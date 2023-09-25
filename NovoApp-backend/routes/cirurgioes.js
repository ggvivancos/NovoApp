const express = require('express');
const router = express.Router();
const { Cirurgiao } = require('../models');

// Listar todos os cirurgiões
router.get('/', async (req, res) => {
    try {
        const cirurgioes = await Cirurgiao.findAll();
        res.json(cirurgioes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar um novo cirurgião
router.post('/', async (req, res) => {
    try {
        const cirurgiao = await Cirurgiao.create(req.body);
        res.json(cirurgiao);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar um cirurgião por ID
router.put('/:id', async (req, res) => {
    try {
        await Cirurgiao.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ success: "Cirurgião atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir um cirurgião por ID
router.delete('/:id', async (req, res) => {
    try {
        await Cirurgiao.destroy({
            where: { id: req.params.id }
        });
        res.json({ success: "Cirurgião excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
