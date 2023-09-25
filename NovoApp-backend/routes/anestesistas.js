const express = require('express');
const router = express.Router();
const { Anestesista, Op } = require('../models');  // Importando o Op do Sequelize

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 25;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    try {
        const anestesistas = await Anestesista.findAll({ 
            limit, 
            offset,
            where: { isDeleted: false }
        });
        const total = await Anestesista.count({ where: { isDeleted: false } });

        res.json({
            data: anestesistas,
            meta: {
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const existingAnestesista = await Anestesista.findOne({
        where: {
            [Op.or]: [
                { nomecompleto: req.body.nomecompleto },
                { nomeabreviado: req.body.nomeabreviado }
            ]
        }
    });

    if (existingAnestesista) {
        return res.status(400).json({ error: 'Anestesista com esses dados já existe.' });
    }

    try {
        const anestesista = await Anestesista.create(req.body);
        res.json(anestesista);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const existingAnestesista = await Anestesista.findOne({
        where: {
            [Op.or]: [
                { nomecompleto: req.body.nomecompleto },
                { nomeabreviado: req.body.nomeabreviado }
            ],
            id: { [Op.ne]: req.params.id }
        }
    });

    if (existingAnestesista) {
        return res.status(400).json({ error: 'Anestesista com esses dados já existe.' });
    }

    try {
        await Anestesista.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ success: "Anestesista atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Anestesista.update({ isDeleted: true }, {
            where: { id: req.params.id }
        });
        res.json({ success: "Anestesista excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/restore/:id', async (req, res) => {
    try {
        await Anestesista.update({ isDeleted: false }, {
            where: { id: req.params.id }
        });
        res.json({ success: "Anestesista restaurado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const anestesista = await Anestesista.findByPk(req.params.id);
        if (!anestesista || anestesista.isDeleted) {
            return res.status(404).json({ error: "Anestesista não encontrado" });
        }
        res.json(anestesista);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
