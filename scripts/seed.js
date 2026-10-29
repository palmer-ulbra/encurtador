// Recria o banco do zero com N links, sem índice. Uso: npm run seed [-- 200000]
import { rmSync } from 'node:fs';

const total = Number(process.argv[2] ?? 200_000);
for (const sufixo of ['', '-wal', '-shm']) rmSync(`data/links.sqlite${sufixo}`, { force: true });

const { db } = await import('../src/db.js');

// O código é o id em base 36: 1 → "1", 200000 → "4abk". O k6 usa a mesma conta.
const inserir = db.prepare('INSERT INTO links (id, codigo, url) VALUES (?, ?, ?)');
db.exec('BEGIN');
for (let id = 1; id <= total; id++) {
  inserir.run(id, id.toString(36), `https://loja.exemplo/promocao/produto/${id}?utm_source=sms`);
}
db.exec('COMMIT');

console.log(`${total} links em data/links.sqlite (sem índice em codigo)`);
