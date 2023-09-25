const express = require('express');
const router = express.Router();
const { Setor } = require('../models');

// Listar todos os setores
router.get('/', async (req, res) => {
    try {
        const setores = await Setor.findAll();
        res.json(setores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar um novo setor
router.post('/', async (req, res) => {
    try {
        const setor = await Setor.create(req.body);
        res.json(setor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar um setor por ID
router.put('/:id', async (req, res) => {
    try {
        await Setor.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ success: "Setor atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir um setor por ID
router.delete('/:id', async (req, res) => {
    try {
        await Setor.destroy({
            where: { id: req.params.id }
        });
        res.json({ success: "Setor excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
