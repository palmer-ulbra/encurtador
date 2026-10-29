// O que todo script k6 do encurtador compartilha.
import http from 'k6/http';

export const BASE = __ENV.BASE || 'http://localhost:3000';

// Um aluno clica num link qualquer dos 200 mil do seed (o código é o id em base 36).
export function clique() {
  const codigo = (1 + Math.floor(Math.random() * 200_000)).toString(36);
  return http.get(`${BASE}/r/${codigo}`, { redirects: 0, tags: { name: 'clique' } });
}
