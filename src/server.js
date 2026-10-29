import express from 'express';
import { db } from './db.js';

const app = express();
app.use(express.json());

// O caminho quente: cada clique no link curto passa aqui.
app.get('/r/:codigo', (req, res) => {
  const link = db
    .prepare('UPDATE links SET cliques = cliques + 1 WHERE codigo = ? RETURNING url')
    .get(req.params.codigo);
  if (!link) return res.status(404).json({ error: 'link não encontrado' });

  res.redirect(302, link.url);
});

app.get('/links/:codigo', (req, res) => {
  const link = db
    .prepare('SELECT codigo, url, cliques FROM links WHERE codigo = ?')
    .get(req.params.codigo);
  if (!link) return res.status(404).json({ error: 'link não encontrado' });

  res.json(link);
});

app.post('/links', (req, res) => {
  const url = req.body.url?.trim();
  if (!url?.startsWith('http')) return res.status(400).json({ error: 'url inválida' });

  const { lastInsertRowid } = db.prepare('INSERT INTO links (codigo, url) VALUES (?, ?)').run('', url);
  const codigo = Number(lastInsertRowid).toString(36);
  db.prepare('UPDATE links SET codigo = ? WHERE id = ?').run(codigo, lastInsertRowid);

  res.status(201).json({ codigo, url, curto: `http://localhost:${porta}/r/${codigo}` });
});

const porta = process.env.PORT ?? 3000;
app.listen(porta, () => console.log(`Encurtador em http://localhost:${porta}`));
