# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/users/getUserListPagination.api.spec.ts >> Get User List Pagination API >> USER_API_012 - should get 5 users successfully
- Location: tests/api/users/getUserListPagination.api.spec.ts:33:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { test, expect } from '../../../src/fixtures/api.fixture';
  2  | import { env } from '../../../src/config/env.config';
  3  | import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
  4  | import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
  5  | import { logger } from '../../../src/helpers/logger.helper';
  6  | 
  7  | type UserListPaginationCase = {
  8  |   testId: string;
  9  |   pageSize: number;
  10 | };
  11 | 
  12 | const userListPaginationCases: UserListPaginationCase[] = [
  13 |   {
  14 |     testId: 'USER_API_012',
  15 |     pageSize: 5
  16 |   },
  17 |   {
  18 |     testId: 'USER_API_013',
  19 |     pageSize: 10
  20 |   },
  21 |   {
  22 |     testId: 'USER_API_014',
  23 |     pageSize: 15
  24 |   },
  25 |   {
  26 |     testId: 'USER_API_015',
  27 |     pageSize: 20
  28 |   }
  29 | ];
  30 | 
  31 | test.describe('Get User List Pagination API', () => {
  32 |   for (const testCase of userListPaginationCases) {
  33 |     test(`${testCase.testId} - should get ${testCase.pageSize} users successfully`, async ({
  34 |       userService
  35 |     }) => {
  36 |       const page = 1;
  37 |       const keyword = '';
  38 | 
  39 |       const response = await userService.getUserListPaging(
  40 |         env.defaultGroup,
  41 |         keyword,
  42 |         page,
  43 |         testCase.pageSize
  44 |       );
  45 | 
  46 |       const responseText = await attachApiRequestResponse(
  47 |         test.info(),
  48 |         `get-user-list-pagination-${testCase.pageSize}-success`,
  49 |         {
  50 |           method: 'GET',
  51 |           query: {
  52 |             MaNhom: env.defaultGroup,
  53 |             tuKhoa: keyword,
  54 |             page,
  55 |             pageSize: testCase.pageSize
  56 |           }
  57 |         },
  58 |         response
  59 |       );
  60 | 
  61 |       expectStatus(response, 200);
  62 |       expectJsonContentType(response);
  63 | 
  64 |       const body = JSON.parse(responseText) as unknown[];
  65 | 
> 66 |       expect(Array.isArray(body)).toBeTruthy();
     |                                   ^ Error: expect(received).toBeTruthy()
  67 |       expect(body).toHaveLength(testCase.pageSize);
  68 | 
  69 |       for (const user of body) {
  70 |         expect(typeof user).toBe('object');
  71 |         expect(user).not.toBeNull();
  72 |       }
  73 | 
  74 |       logger.pass(
  75 |         `Get User List Pagination API returned ${body.length}/${testCase.pageSize} users successfully.`
  76 |       );
  77 |     });
  78 |   }
  79 | });
  80 | 
```