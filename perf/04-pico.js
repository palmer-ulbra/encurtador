// Passo 10 — pico: o SMS chegou, de quase zero a 200 em 5 segundos.
import { check, sleep } from 'k6';
import { clique } from './comum.js';

export const options = {
  stages: [
    { duration: '5s', target: 200 },
    { duration: '1m', target: 200 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<100'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  check(clique(), { 'redirecionou (302)': (r) => r.status === 302 });
  sleep(1);
}
