const express = require('express');
const path = require('path');
const { consultarDebitos } = require('./database'); // Certifique-se de que o caminho está correto

const app = express();
const PORT = 3001;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para consultar débitos
app.get('/api/debitos', (req, res) => {
    const { cpfCnpj, dataInicio, dataFim } = req.query;

    // Chama a função consultarDebitos e passa os parâmetros
    consultarDebitos(cpfCnpj, dataInicio, dataFim, (err, results) => {
        if (err) {
            console.error('Erro ao consultar débitos:', err);
            return res.status(500).json({ error: 'Erro ao consultar débitos' });
        }
        res.json(results);
    });
});

// Inicia o servidor na porta especificada
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
