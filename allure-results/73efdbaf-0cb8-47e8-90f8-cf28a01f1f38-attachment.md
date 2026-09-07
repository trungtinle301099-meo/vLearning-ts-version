# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/home/homePage.ui.spec.ts >> Home Page UI >> HOME_PAGE_UI_005 - should navigate to course page after clicking Khoá học link
- Location: tests/ui/home/homePage.ui.spec.ts:92:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Khoá học', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - link "..." [ref=e5] [cursor=pointer]:
        - /url: /
        - img "..." [ref=e6]
      - textbox "Tìm kiếm" [ref=e8]
    - list [ref=e10]:
      - listitem [ref=e11]:
        - generic [ref=e12]: 
        - link "Danh mục" [ref=e13] [cursor=pointer]:
          - /url: /trangchu
        - list:
          - listitem [ref=e14]:
            - link "Lập trình Backend" [ref=e15] [cursor=pointer]:
              - /url: /danhmuckhoahoc/BackEnd
          - listitem [ref=e16]:
            - link "Thiết kế Web" [ref=e17] [cursor=pointer]:
              - /url: /danhmuckhoahoc/Design
          - listitem [ref=e18]:
            - link "Lập trình di động" [ref=e19] [cursor=pointer]:
              - /url: /danhmuckhoahoc/DiDong
          - listitem [ref=e20]:
            - link "Lập trình Front end" [ref=e21] [cursor=pointer]:
              - /url: /danhmuckhoahoc/FrontEnd
          - listitem [ref=e22]:
            - link "Lập trình Full Stack" [ref=e23] [cursor=pointer]:
              - /url: /danhmuckhoahoc/FullStack
          - listitem [ref=e24]:
            - link "Tư duy lập trình" [ref=e25] [cursor=pointer]:
              - /url: /danhmuckhoahoc/TuDuy
      - listitem [ref=e26]:
        - link "Khóa học" [active] [ref=e27] [cursor=pointer]:
          - /url: /khoahoc
      - listitem [ref=e28]:
        - link "Blog" [ref=e29] [cursor=pointer]:
          - /url: /blog
      - listitem [ref=e30]:
        - link "Sự kiện" [ref=e31] [cursor=pointer]:
          - /url: /sukien
        - list:
          - listitem [ref=e32]:
            - link "Sự kiện Sale Cuối Năm" [ref=e33] [cursor=pointer]:
              - /url: /sukien/lastYear
          - listitem [ref=e34]:
            - link "Sự kiện Giáng sinh" [ref=e35] [cursor=pointer]:
              - /url: /sukien/Noel
          - listitem [ref=e36]:
            - link "Sự kiện Noel" [ref=e37] [cursor=pointer]:
              - /url: /sukien/Noel
      - listitem [ref=e38]:
        - link "Thông tin" [ref=e39] [cursor=pointer]:
          - /url: /thongtin
    - generic [ref=e40]:
      - generic [ref=e41]:
        - link "" [ref=e43] [cursor=pointer]:
          - /url: /admin/quanlynguoidung
          - generic [ref=e44]: 
        - link "" [ref=e45] [cursor=pointer]:
          - /url: /thongtincanhan
          - img [ref=e46]
          - link "" [ref=e48]:
            - /url: /trangchu
            - generic [ref=e49]: 
      - text: 
  - generic [ref=e50]:
    - generic [ref=e51]:
      - heading "Khóa học" [level=3] [ref=e52]
      - paragraph [ref=e53]: Bắt đầu hành trình nào!!!
    - generic [ref=e55]:
      - generic [ref=e57]:
        - heading "Chương trình học" [level=6] [ref=e58]
        - generic [ref=e59]: 
        - paragraph [ref=e60]: "300"
      - generic [ref=e62]:
        - heading "Nhà sáng tạo" [level=6] [ref=e63]
        - generic [ref=e64]: 
        - paragraph [ref=e65]: "10000"
      - generic [ref=e67]:
        - heading "Nhà thiết kế" [level=6] [ref=e68]
        - generic [ref=e69]: 
        - paragraph [ref=e70]: "400"
      - generic [ref=e72]:
        - heading "Bài giảng" [level=6] [ref=e73]
        - generic [ref=e74]: 
        - paragraph [ref=e75]: "3000"
      - generic [ref=e77]:
        - heading "Video" [level=6] [ref=e78]
        - generic [ref=e79]: 
        - paragraph [ref=e80]: "40000"
      - generic [ref=e82]:
        - heading "Lĩnh vực" [level=6] [ref=e83]
        - generic [ref=e84]: 
        - paragraph [ref=e85]: "200"
    - generic [ref=e86]:
      - heading " Danh sách khóa học" [level=6] [ref=e87]:
        - generic [ref=e88]: 
        - text: Danh sách khóa học
      - generic [ref=e89]:
        - link "Javascriptt12 Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e91] [cursor=pointer]:
          - /url: /chitiet/
          - generic [ref=e92]: Javascriptt12
          - generic [ref=e93]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e94]
            - generic [ref=e97]: Elon Musk
          - generic [ref=e98]:
            - generic [ref=e99]:
              - paragraph [ref=e100]:
                - text: "800.000"
                - superscript [ref=e101]: đ
              - paragraph [ref=e102]:
                - text: "400.000"
                - superscript [ref=e103]: đ
            - generic [ref=e104]:
              - generic [ref=e105]: 
              - text: 4.9(7840)
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e107] [cursor=pointer]:
          - /url: /chitiet/.100
          - generic [ref=e108]: Lập trình web
          - generic [ref=e109]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e110]
            - generic [ref=e113]: Elon Musk
          - generic [ref=e114]:
            - generic [ref=e115]:
              - paragraph [ref=e116]:
                - text: "800.000"
                - superscript [ref=e117]: đ
              - paragraph [ref=e118]:
                - text: "400.000"
                - superscript [ref=e119]: đ
            - generic [ref=e120]:
              - generic [ref=e121]: 
              - text: 4.9(7840)
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e123] [cursor=pointer]:
          - /url: /chitiet/000
          - generic [ref=e124]: Lập trình web
          - generic [ref=e125]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e126]
            - generic [ref=e129]: Elon Musk
          - generic [ref=e130]:
            - generic [ref=e131]:
              - paragraph [ref=e132]:
                - text: "800.000"
                - superscript [ref=e133]: đ
              - paragraph [ref=e134]:
                - text: "400.000"
                - superscript [ref=e135]: đ
            - generic [ref=e136]:
              - generic [ref=e137]: 
              - text: 4.9(7840)
        - link "Khóa học mới 2026 Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e139] [cursor=pointer]:
          - /url: /chitiet/000123456
          - generic [ref=e140]: Khóa học mới 2026
          - generic [ref=e141]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e142]
            - generic [ref=e145]: Elon Musk
          - generic [ref=e146]:
            - generic [ref=e147]:
              - paragraph [ref=e148]:
                - text: "800.000"
                - superscript [ref=e149]: đ
              - paragraph [ref=e150]:
                - text: "400.000"
                - superscript [ref=e151]: đ
            - generic [ref=e152]:
              - generic [ref=e153]: 
              - text: 4.9(7840)
        - link "EditKhoaHoc Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e155] [cursor=pointer]:
          - /url: /chitiet/01230123
          - generic [ref=e156]: EditKhoaHoc
          - generic [ref=e157]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e158]
            - generic [ref=e161]: Elon Musk
          - generic [ref=e162]:
            - generic [ref=e163]:
              - paragraph [ref=e164]:
                - text: "800.000"
                - superscript [ref=e165]: đ
              - paragraph [ref=e166]:
                - text: "400.000"
                - superscript [ref=e167]: đ
            - generic [ref=e168]:
              - generic [ref=e169]: 
              - text: 4.9(7840)
        - link "Python thiếu nhi Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e171] [cursor=pointer]:
          - /url: /chitiet/09876788
          - generic [ref=e172]: Python thiếu nhi
          - generic [ref=e173]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e174]
            - generic [ref=e177]: Elon Musk
          - generic [ref=e178]:
            - generic [ref=e179]:
              - paragraph [ref=e180]:
                - text: "800.000"
                - superscript [ref=e181]: đ
              - paragraph [ref=e182]:
                - text: "400.000"
                - superscript [ref=e183]: đ
            - generic [ref=e184]:
              - generic [ref=e185]: 
              - text: 4.9(7840)
        - link "Javascript nâng cao mới Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e187] [cursor=pointer]:
          - /url: /chitiet/100999
          - generic [ref=e188]: Javascript nâng cao mới
          - generic [ref=e189]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e190]
            - generic [ref=e193]: Elon Musk
          - generic [ref=e194]:
            - generic [ref=e195]:
              - paragraph [ref=e196]:
                - text: "800.000"
                - superscript [ref=e197]: đ
              - paragraph [ref=e198]:
                - text: "400.000"
                - superscript [ref=e199]: đ
            - generic [ref=e200]:
              - generic [ref=e201]: 
              - text: 4.9(7840)
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e203] [cursor=pointer]:
          - /url: /chitiet/1009991
          - generic [ref=e204]: Lập trình web
          - generic [ref=e205]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e206]
            - generic [ref=e209]: Elon Musk
          - generic [ref=e210]:
            - generic [ref=e211]:
              - paragraph [ref=e212]:
                - text: "800.000"
                - superscript [ref=e213]: đ
              - paragraph [ref=e214]:
                - text: "400.000"
                - superscript [ref=e215]: đ
            - generic [ref=e216]:
              - generic [ref=e217]: 
              - text: 4.9(7840)
        - link "NodeJS001123 fdsfsdffds Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e219] [cursor=pointer]:
          - /url: /chitiet/10099922
          - generic [ref=e220]: NodeJS001123 fdsfsdffds
          - generic [ref=e221]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e222]
            - generic [ref=e225]: Elon Musk
          - generic [ref=e226]:
            - generic [ref=e227]:
              - paragraph [ref=e228]:
                - text: "800.000"
                - superscript [ref=e229]: đ
              - paragraph [ref=e230]:
                - text: "400.000"
                - superscript [ref=e231]: đ
            - generic [ref=e232]:
              - generic [ref=e233]: 
              - text: 4.9(7840)
        - link "Doraemon Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e235] [cursor=pointer]:
          - /url: /chitiet/100999999
          - generic [ref=e236]: Doraemon
          - generic [ref=e237]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e238]
            - generic [ref=e241]: Elon Musk
          - generic [ref=e242]:
            - generic [ref=e243]:
              - paragraph [ref=e244]:
                - text: "800.000"
                - superscript [ref=e245]: đ
              - paragraph [ref=e246]:
                - text: "400.000"
                - superscript [ref=e247]: đ
            - generic [ref=e248]:
              - generic [ref=e249]: 
              - text: 4.9(7840)
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e251] [cursor=pointer]:
          - /url: /chitiet/1111111111
          - generic [ref=e252]: Lập trình web
          - generic [ref=e253]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e254]
            - generic [ref=e257]: Elon Musk
          - generic [ref=e258]:
            - generic [ref=e259]:
              - paragraph [ref=e260]:
                - text: "800.000"
                - superscript [ref=e261]: đ
              - paragraph [ref=e262]:
                - text: "400.000"
                - superscript [ref=e263]: đ
            - generic [ref=e264]:
              - generic [ref=e265]: 
              - text: 4.9(7840)
        - link "Javascript nâng cao 101 Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e267] [cursor=pointer]:
          - /url: /chitiet/111111111111
          - generic [ref=e268]: Javascript nâng cao 101
          - generic [ref=e269]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e270]
            - generic [ref=e273]: Elon Musk
          - generic [ref=e274]:
            - generic [ref=e275]:
              - paragraph [ref=e276]:
                - text: "800.000"
                - superscript [ref=e277]: đ
              - paragraph [ref=e278]:
                - text: "400.000"
                - superscript [ref=e279]: đ
            - generic [ref=e280]:
              - generic [ref=e281]: 
              - text: 4.9(7840)
    - list [ref=e282]:
      - listitem [ref=e283]:
        - button "Previous page" [disabled] [ref=e284] [cursor=pointer]: < Trước
      - listitem [ref=e285]:
        - button "Page 1 is your current page" [ref=e286] [cursor=pointer]: "1"
      - listitem [ref=e287]:
        - button "Page 2" [ref=e288] [cursor=pointer]: "2"
      - listitem [ref=e289]:
        - button "Page 3" [ref=e290] [cursor=pointer]: "3"
      - listitem [ref=e291]:
        - button "..." [ref=e292] [cursor=pointer]
      - listitem [ref=e293]:
        - button "Page 15" [ref=e294] [cursor=pointer]: "15"
      - listitem [ref=e295]:
        - button "Page 16" [ref=e296] [cursor=pointer]: "16"
      - listitem [ref=e297]:
        - button "Page 17" [ref=e298] [cursor=pointer]: "17"
      - listitem [ref=e299]:
        - button "Next page" [ref=e300] [cursor=pointer]: Sau >
  - generic [ref=e301]:
    - generic [ref=e304]:
      - generic [ref=e305]:
        - link "V learning " [ref=e306] [cursor=pointer]:
          - /url: ""
          - text: V learning
          - generic [ref=e307]: 
        - list [ref=e308]:
          - listitem [ref=e309]:
            - generic [ref=e310]: 
            - text: 1800-123-4567
          - listitem [ref=e311]:
            - generic [ref=e312]: 
            - text: devit@gmail.com
          - listitem [ref=e313]:
            - generic [ref=e314]: 
            - text: Đà Nẵng
      - generic [ref=e315]:
        - heading "Liên kết" [level=3] [ref=e316]
        - list [ref=e317]:
          - listitem [ref=e318]:
            - generic [ref=e319]: 
            - text: Trang chủ
          - listitem [ref=e320]:
            - generic [ref=e321]: 
            - text: Dịch vụ
          - listitem [ref=e322]:
            - generic [ref=e323]: 
            - text: Nhóm
          - listitem [ref=e324]:
            - generic [ref=e325]: 
            - text: Blog
      - generic [ref=e326]:
        - heading "Khóa học" [level=3] [ref=e327]
        - list [ref=e328]:
          - listitem [ref=e329]:
            - generic [ref=e330]: 
            - text: Front End
          - listitem [ref=e331]:
            - generic [ref=e332]: 
            - text: Back End
          - listitem [ref=e333]:
            - generic [ref=e334]: 
            - text: Full stack
          - listitem [ref=e335]:
            - generic [ref=e336]: 
            - text: Node Js
      - generic [ref=e337]:
        - heading "Đăng kí tư vấn" [level=3] [ref=e338]
        - generic [ref=e339]:
          - textbox "Họ và tên" [ref=e340]
          - textbox "Email" [ref=e341]
          - textbox "Số điện thoại" [ref=e342]
        - button "Đăng kí" [ref=e343] [cursor=pointer]
    - generic [ref=e344]:
      - paragraph [ref=e346]: Copyright © 2021. All rights reserved.
      - generic [ref=e347]:
        - generic [ref=e348]: 
        - generic [ref=e349]: 
        - generic [ref=e350]: 
```

# Test source

```ts
  1  | import type { FrameLocator, Locator, Page } from '@playwright/test';
  2  | 
  3  | export class BasePage {
  4  |   constructor(protected readonly page: Page) {}
  5  | 
  6  |   async goto(url: string): Promise<void> {
  7  |     await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  8  |   }
  9  | 
  10 |   async reload(): Promise<void> {
  11 |     await this.page.reload({ waitUntil: 'domcontentloaded' });
  12 |   }
  13 | 
  14 |   async waitForPageLoaded(): Promise<void> {
  15 |     await this.page.waitForLoadState('domcontentloaded');
  16 |   }
  17 | 
  18 |   async waitForUrl(url: string | RegExp): Promise<void> {
  19 |     await this.page.waitForURL(url);
  20 |   }
  21 | 
  22 |   async click(locator: Locator): Promise<void> {
> 23 |     await locator.click();
     |                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  24 |   }
  25 | 
  26 |   async fill(locator: Locator, value: string): Promise<void> {
  27 |     await locator.fill(value);
  28 |   }
  29 | 
  30 |   async clearAndFill(locator: Locator, value: string): Promise<void> {
  31 |     await locator.clear();
  32 |     await locator.fill(value);
  33 |   }
  34 | 
  35 |   async press(locator: Locator, key: string): Promise<void> {
  36 |     await locator.press(key);
  37 |   }
  38 | 
  39 |   async hover(locator: Locator): Promise<void> {
  40 |     await locator.hover();
  41 |   }
  42 | 
  43 |   async waitForVisible(locator: Locator): Promise<void> {
  44 |     await locator.waitFor({ state: 'visible' });
  45 |   }
  46 | 
  47 |   async waitForHidden(locator: Locator): Promise<void> {
  48 |     await locator.waitFor({ state: 'hidden' });
  49 |   }
  50 | 
  51 |   async isVisible(locator: Locator): Promise<boolean> {
  52 |     return locator.isVisible();
  53 |   }
  54 | 
  55 |   async isEnabled(locator: Locator): Promise<boolean> {
  56 |     return locator.isEnabled();
  57 |   }
  58 | 
  59 |   async getText(locator: Locator): Promise<string> {
  60 |     return (await locator.textContent())?.trim() ?? '';
  61 |   }
  62 | 
  63 |   async getInputValue(locator: Locator): Promise<string> {
  64 |     return locator.inputValue();
  65 |   }
  66 | 
  67 |   async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
  68 |     return locator.getAttribute(attributeName);
  69 |   }
  70 | 
  71 |   async getCurrentUrl(): Promise<string> {
  72 |     return this.page.url();
  73 |   }
  74 | 
  75 |   async getTitle(): Promise<string> {
  76 |     return this.page.title();
  77 |   }
  78 | 
  79 |   async scrollToElement(locator: Locator): Promise<void> {
  80 |     await locator.scrollIntoViewIfNeeded();
  81 |   }
  82 | 
  83 |   async scrollToTop(): Promise<void> {
  84 |     await this.page.evaluate(() => window.scrollTo(0, 0));
  85 |   }
  86 | 
  87 |   async scrollToBottom(): Promise<void> {
  88 |     await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  89 |   }
  90 | 
  91 |   getFrame(selector: string): FrameLocator {
  92 |     return this.page.frameLocator(selector);
  93 |   }
  94 | 
  95 |   async takeScreenshot(): Promise<Buffer> {
  96 |     return this.page.screenshot({ fullPage: true });
  97 |   }
  98 | }
  99 | 
```