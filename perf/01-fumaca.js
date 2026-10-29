// Passo 1 — uma pessoa, dez cliques: o sistema responde?
import { check } from 'k6';
import { clique } from './comum.js';

export const options = { vus: 1, iterations: 10 };

export default function () {
  const res = clique();
  check(res, { 'redirecionou (302)': (r) => r.status === 302 });
}
