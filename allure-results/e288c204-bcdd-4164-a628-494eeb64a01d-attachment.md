# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/users/getUserListPagination.spec.ts >> Get User List Pagination API >> USER_API_015 - should get 20 users successfully
- Location: tests/api/users/getUserListPagination.spec.ts:34:9

# Error details

```
ZodError: [
  {
    "expected": "array",
    "code": "invalid_type",
    "path": [],
    "message": "Invalid input: expected array, received object"
  }
]
```

# Test source

```ts
  1  | import { test, expect } from '../../../src/fixtures/api.fixture';
  2  | import { env } from '../../../src/config/env.config';
  3  | import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
  4  | import { getUserListPaginationResponseSchema } from '../../../src/schemas/user.schema';
  5  | import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
  6  | import { logger } from '../../../src/helpers/logger.helper';
  7  | 
  8  | type PaginationTestCase = {
  9  |   testId: string;
  10 |   pageSize: number;
  11 | };
  12 | 
  13 | const paginationTestCases: PaginationTestCase[] = [
  14 |   {
  15 |     testId: 'USER_API_012',
  16 |     pageSize: 5
  17 |   },
  18 |   {
  19 |     testId: 'USER_API_013',
  20 |     pageSize: 10
  21 |   },
  22 |   {
  23 |     testId: 'USER_API_014',
  24 |     pageSize: 15
  25 |   },
  26 |   {
  27 |     testId: 'USER_API_015',
  28 |     pageSize: 20
  29 |   }
  30 | ];
  31 | 
  32 | test.describe('Get User List Pagination API', () => {
  33 |   for (const testCase of paginationTestCases) {
  34 |     test(`${testCase.testId} - should get ${testCase.pageSize} users successfully`, async ({
  35 |       userService
  36 |     }) => {
  37 |       const page = 1;
  38 |       const keyword = '';
  39 | 
  40 |       const response = await userService.getUserListPaging(
  41 |         env.defaultGroup,
  42 |         keyword,
  43 |         page,
  44 |         testCase.pageSize
  45 |       );
  46 | 
  47 |       const responseText = await attachApiRequestResponse(
  48 |         test.info(),
  49 |         `get-user-list-pagination-${testCase.pageSize}-success`,
  50 |         {
  51 |           method: 'GET',
  52 |           query: {
  53 |             MaNhom: env.defaultGroup,
  54 |             tuKhoa: keyword,
  55 |             page,
  56 |             pageSize: testCase.pageSize
  57 |           }
  58 |         },
  59 |         response
  60 |       );
  61 | 
  62 |       expectStatus(response, 200);
  63 |       expectJsonContentType(response);
  64 | 
> 65 |       const parsed = getUserListPaginationResponseSchema.parse(JSON.parse(responseText));
     |                                                          ^ ZodError: [
  66 | 
  67 |       expect(Array.isArray(parsed)).toBeTruthy();
  68 |       expect(parsed).toHaveLength(testCase.pageSize);
  69 | 
  70 |       for (const user of parsed) {
  71 |         expect(Object.keys(user).length).toBeGreaterThan(0);
  72 |       }
  73 | 
  74 |       logger.pass(
  75 |         `Get User List Pagination API returned ${parsed.length}/${testCase.pageSize} users successfully.`
  76 |       );
  77 |     });
  78 |   }
  79 | });
  80 | 
```