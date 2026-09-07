import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, K6_TARGET_PATH, TOKEN_CYBERSOFT } from '../config/k6.env.js';
import { loadThresholds } from '../thresholds/api.threshold.js';
import { loadScenario } from '../scenarios/load.scenario.js';

export const options = {
  scenarios: {
    load_test: loadScenario
  },
  thresholds: loadThresholds
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
    'response time is lower than 3000ms': (res) => res.timings.duration < 3000
  });

  sleep(1);
}
