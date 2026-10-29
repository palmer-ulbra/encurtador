# Encurtador de links — demo de k6

Aplicação mínima para a aula de testes de desempenho:

**k6 → API (Express) → SQLite**

Precisa de Node 22.13 ou mais novo (usa o `node:sqlite`, que já vem no Node) e do
[k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) (`brew install k6`).

## Rodar a aplicação

```bash
npm install
npm run seed      # recria data/links.sqlite com 200 mil links, SEM índice
npm start         # http://localhost:3000
```

```bash
curl -i http://localhost:3000/r/1          # 302 para a URL longa, soma 1 clique
curl http://localhost:3000/links/1         # { codigo, url, cliques }
curl -X POST http://localhost:3000/links -H 'content-type: application/json' \
  -d '{"url":"https://ulbra.br"}'          # 201 com o link curto
```

## Rodar os testes de desempenho

Com a aplicação rodando, em outro terminal:

```bash
k6 run perf/01-fumaca.js      # 1 pessoa, 10 cliques
k6 run perf/02-carga.js       # 50 pessoas por 30 s — passa
k6 run perf/03-estresse.js    # degraus até 200 pessoas — reprova (código de saída 99)
```

Outra porta: `BASE=http://localhost:3014 k6 run perf/01-fumaca.js`.

## O gargalo e a correção

```bash
npm run sql -- "EXPLAIN QUERY PLAN SELECT url FROM links WHERE codigo = '4abk'"   # SCAN links
npm run sql -- "CREATE INDEX idx_links_codigo ON links (codigo)"
npm run sql -- "EXPLAIN QUERY PLAN SELECT url FROM links WHERE codigo = '4abk'"   # SEARCH ... USING INDEX
k6 run perf/03-estresse.js    # passa
```

Não precisa reiniciar o servidor. Para voltar ao estado sem índice: `npm run seed`.

## Onde está cada coisa

| Arquivo | O que faz |
| --- | --- |
| `src/server.js` | as rotas: `GET /r/:codigo`, `GET /links/:codigo`, `POST /links` |
| `src/db.js` | abre o SQLite e cria a tabela `links` (sem índice em `codigo`, de propósito) |
| `scripts/seed.js` | gera os links; o código é o id em base 36 (`1`, `2`, … `4abk`) |
| `scripts/sql.js` | roda um SQL qualquer no banco |
| `perf/` | os scripts k6; `comum.js` sorteia um link e faz o clique |
