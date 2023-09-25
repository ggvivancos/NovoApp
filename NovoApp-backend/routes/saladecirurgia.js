// routes/salaDeCirurgia.js

const express = require('express');
const router = express.Router();
const { SalaDeCirurgia } = require('../models');

// Listar todas as salas
router.get('/', async (req, res) => {
    try {
        const salas = await SalaDeCirurgia.findAll();
        res.json(salas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar uma nova sala
router.post('/', async (req, res) => {
    try {
        const sala = await SalaDeCirurgia.create(req.body);
        res.json(sala);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
