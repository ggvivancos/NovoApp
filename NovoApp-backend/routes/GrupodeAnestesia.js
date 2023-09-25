const express = require('express');
const router = express.Router();
const { GrupoDeAnestesia } = require('../models');

// Listar todos os grupos
router.get('/', async (req, res) => {
    try {
        const grupos = await GrupoDeAnestesia.findAll();
        res.json(grupos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar um novo grupo
router.post('/', async (req, res) => {
    try {
        const grupo = await GrupoDeAnestesia.create(req.body);
        res.json(grupo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
