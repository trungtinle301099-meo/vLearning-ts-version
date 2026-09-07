import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, K6_TARGET_PATH, TOKEN_CYBERSOFT } from '../config/k6.env.js';
import { smokeThresholds } from '../thresholds/api.threshold.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: smokeThresholds
};

export default function () {
  const url = `${BASE_URL}${K6_TARGET_PATH}`;

  const params = {
    headers: {
      accept: 'application/json',
      ...(TOKEN_CYBERSOFT ? { TokenCybersoft: TOKEN_CYBERSOFT } : {})
    }
  };

  const response = http.get(url, params);

  check(response, {
    'status is lower than 500': (res) => res.status < 500,
    'response time is lower than 2000ms': (res) => res.timings.duration < 2000
  });
}
