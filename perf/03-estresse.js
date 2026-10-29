// Passos 6 e 8 — sobe em degraus além do esperado, até descobrir onde dobra.
import { check, sleep } from 'k6';
import { clique } from './comum.js';

export const options = {
  stages: [
    { duration: '20s', target: 50 },
    { duration: '20s', target: 100 },
    { duration: '20s', target: 200 },
    { duration: '10s', target: 0 },
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
