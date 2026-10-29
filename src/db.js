import { DatabaseSync } from 'node:sqlite';

export const db = new DatabaseSync(process.env.DB_FILE ?? 'data/links.sqlite');

// WAL: o servidor lê enquanto o `npm run sql` cria o índice, sem travar o arquivo.
db.exec('PRAGMA journal_mode = WAL');

// Sem índice em `codigo`, de propósito: é o gargalo da Aula 14.
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL,
    url TEXT NOT NULL,
    cliques INTEGER NOT NULL DEFAULT 0
  )
`);
