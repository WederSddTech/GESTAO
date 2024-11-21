// src/app.js
const express = require('express');
const path = require('path');
const { consultarDebitos } = require('./database');

const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/debitos', (req, res) => {
    const { cpfCnpj, dataInicio, dataFim } = req.query;
    consultarDebitos(cpfCnpj, dataInicio, dataFim, (err, results) => {
        if (err) {
            console.error('Erro ao consultar débitos:', err);
            return res.status(500).json({ error: 'Erro ao consultar débitos' });
        }
        res.json(results);
    });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
