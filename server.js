// Servidor Express para hospedar o site no Render
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// Compressão de arquivos
app.use(compression());

// Servir arquivos estáticos (raiz do projeto)
// Obs: mantém assets funcionando e evita conflito com rotas
app.use(express.static(path.join(__dirname, '.')));

// Garantia extra: sempre servir /assets no caminho correto
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Fallback para assets (evita problemas em alguns ambientes)
app.get('/assets/:file', (req, res) => {
    const filePath = path.join(__dirname, 'assets', req.params.file);
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).send('Not Found');
    });
});


// Middleware para servir HTML sem extensão
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para páginas
app.get('/informacoes', (req, res) => {
    res.sendFile(path.join(__dirname, 'informacoes.html'));
});

app.get('/denuncias', (req, res) => {
    res.sendFile(path.join(__dirname, 'denuncias.html'));
});

app.get('/recursos', (req, res) => {
    res.sendFile(path.join(__dirname, 'recursos.html'));
});

// Tratamento de erros 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🛡️ Segurança do Trabalho - Servidor rodando em http://localhost:${PORT}`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
    console.log(`🔒 Ambiente 100% Confidencial`);
});
