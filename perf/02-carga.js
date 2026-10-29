// Passos 4 e 5 — a carga esperada, com o requisito como threshold.
import { check, sleep } from 'k6';
import { clique } from './comum.js';

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<100'], // requisito: p95 abaixo de 100 ms
    http_req_failed: ['rate<0.01'], // requisito: menos de 1% de erro
  },
};

export default function () {
  check(clique(), { 'redirecionou (302)': (r) => r.status === 302 });
  sleep(1); // cada pessoa clica uma vez por segundo
}
