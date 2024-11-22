const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados
const dbPath = path.resolve(__dirname, '../gestao.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conexão com o banco de dados estabelecida.');
    }
});

// Função para consultar débitos
function consultarDebitos(cpfCnpj, dataInicio, dataFim, callback) {
    let query = `SELECT cliente, cpf_cnpj, nuntitulo, GROUP_CONCAT(json_object(
                    'nuntitulo', nuntitulo,
                    'datavencimento', datavencimento,
                    'valor', valor,
                    'linhadigitavel', linhadigitavel
                 )) as debitos,
                 SUM(valor) as totalDebitos
                 FROM aut_titulos_receber 
                 WHERE cpf_cnpj = ?`;
    const params = [cpfCnpj];

    if (dataInicio) {
        query += ` AND datavencimento >= ?`;
        params.push(dataInicio);
    }
    if (dataFim) {
        query += ` AND datavencimento <= ?`;
        params.push(dataFim);
    }

    query += ` GROUP BY cliente, cpf_cnpj, nuntitulo`;

    db.all(query, params, (err, rows) => {
        if (err) {
            callback(err, null);
            return;
        }
        const resultados = rows.map(row => ({
            ...row,
            debitos: JSON.parse(`[${row.debitos}]`),
            totalDebitos: row.totalDebitos
        }));
        callback(null, resultados);
    });
}

module.exports = { consultarDebitos };
