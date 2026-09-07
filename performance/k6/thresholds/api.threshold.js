export const smokeThresholds = {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<2000']
};

export const loadThresholds = {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<3000', 'p(99)<5000']
};
