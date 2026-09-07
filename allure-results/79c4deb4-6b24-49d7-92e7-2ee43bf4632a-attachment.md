# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/users/getUserListPagination.api.spec.ts >> Get User List Pagination API >> GET_USER_LIST_PAGINATION_API_004 - should get 20 users successfully
- Location: tests/api/users/getUserListPagination.api.spec.ts:128:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  62  |     const responseText = await attachApiRequestResponse(
  63  |       test.info(),
  64  |       'get-user-list-pagination-10-success',
  65  |       {
  66  |         method: 'GET',
  67  |         query: {
  68  |           MaNhom: env.defaultGroup,
  69  |           tuKhoa: keyword,
  70  |           page,
  71  |           pageSize
  72  |         }
  73  |       },
  74  |       response
  75  |     );
  76  | 
  77  |     expectStatus(response, 200);
  78  |     expectJsonContentType(response);
  79  | 
  80  |     const body = JSON.parse(responseText) as unknown[];
  81  | 
  82  |     expect(Array.isArray(body)).toBeTruthy();
  83  |     expect(body).toHaveLength(pageSize);
  84  | 
  85  |     logger.pass(`Get User List Pagination API returned ${pageSize} users successfully.`);
  86  |   });
  87  | 
  88  |   test('GET_USER_LIST_PAGINATION_API_003 - should get 15 users successfully', async ({
  89  |     userService
  90  |   }) => {
  91  |     const page = 1;
  92  |     const pageSize = 15;
  93  |     const keyword = '';
  94  | 
  95  |     const response = await userService.getUserListPaging(
  96  |       env.defaultGroup,
  97  |       keyword,
  98  |       page,
  99  |       pageSize
  100 |     );
  101 | 
  102 |     const responseText = await attachApiRequestResponse(
  103 |       test.info(),
  104 |       'get-user-list-pagination-15-success',
  105 |       {
  106 |         method: 'GET',
  107 |         query: {
  108 |           MaNhom: env.defaultGroup,
  109 |           tuKhoa: keyword,
  110 |           page,
  111 |           pageSize
  112 |         }
  113 |       },
  114 |       response
  115 |     );
  116 | 
  117 |     expectStatus(response, 200);
  118 |     expectJsonContentType(response);
  119 | 
  120 |     const body = JSON.parse(responseText) as unknown[];
  121 | 
  122 |     expect(Array.isArray(body)).toBeTruthy();
  123 |     expect(body).toHaveLength(pageSize);
  124 | 
  125 |     logger.pass(`Get User List Pagination API returned ${pageSize} users successfully.`);
  126 |   });
  127 | 
  128 |   test('GET_USER_LIST_PAGINATION_API_004 - should get 20 users successfully', async ({
  129 |     userService
  130 |   }) => {
  131 |     const page = 1;
  132 |     const pageSize = 20;
  133 |     const keyword = '';
  134 | 
  135 |     const response = await userService.getUserListPaging(
  136 |       env.defaultGroup,
  137 |       keyword,
  138 |       page,
  139 |       pageSize
  140 |     );
  141 | 
  142 |     const responseText = await attachApiRequestResponse(
  143 |       test.info(),
  144 |       'get-user-list-pagination-20-success',
  145 |       {
  146 |         method: 'GET',
  147 |         query: {
  148 |           MaNhom: env.defaultGroup,
  149 |           tuKhoa: keyword,
  150 |           page,
  151 |           pageSize
  152 |         }
  153 |       },
  154 |       response
  155 |     );
  156 | 
  157 |     expectStatus(response, 200);
  158 |     expectJsonContentType(response);
  159 | 
  160 |     const body = JSON.parse(responseText) as unknown[];
  161 | 
> 162 |     expect(Array.isArray(body)).toBeTruthy();
      |                                 ^ Error: expect(received).toBeTruthy()
  163 |     expect(body).toHaveLength(pageSize);
  164 | 
  165 |     logger.pass(`Get User List Pagination API returned ${pageSize} users successfully.`);
  166 |   });
  167 | });
  168 | 
```