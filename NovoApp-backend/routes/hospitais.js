const express = require('express');
const router = express.Router();
const { Hospital } = require('../models');

// Listar todos os hospitais
router.get('/', async (req, res) => {
    try {
        const hospitais = await Hospital.findAll();
        res.json(hospitais);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar um novo hospital
router.post('/', async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.json(hospital);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar um hospital por ID
router.put('/:id', async (req, res) => {
    try {
        await Hospital.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ success: "Hospital atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir um hospital por ID
router.delete('/:id', async (req, res) => {
    try {
        await Hospital.destroy({
            where: { id: req.params.id }
        });
        res.json({ success: "Hospital excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
