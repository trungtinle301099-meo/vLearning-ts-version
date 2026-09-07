export const loadScenario = {
  executor: 'ramping-vus',
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 }
  ]
};
