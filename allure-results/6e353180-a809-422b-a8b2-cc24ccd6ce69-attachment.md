# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/home/logout.ui.spec.ts >> Logout UI >> LOGOUT_UI_001 - should logout successfully after hovering avatar icon
- Location: tests/ui/home/logout.ui.spec.ts:10:7

# Error details

```
Error: Wait until logout button is not overlapped with avatar icon

Wait until logout button is not overlapped with avatar icon

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
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
        - link "Khóa học" [ref=e27] [cursor=pointer]:
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
    - generic [ref=e58]:
      - heading "Chào mừng" [level=1] [ref=e59]
      - heading "đến với môi trường" [level=1] [ref=e60]
      - heading "Vlearning" [level=1] [ref=e61]
      - button "Bắt đâu nào" [ref=e62] [cursor=pointer]
    - generic [ref=e67]:
      - generic [ref=e69]:
        - heading "Khóa học" [level=3] [ref=e70]
        - paragraph [ref=e71]: Học qua dự án thực tế, học đi đôi với hành, không lý thuyết lan man, phân tích cội nguồn của vấn đề, xây dựng từ các ví dụ nhỏ đến thực thi một dự án lớn ngoài thực tế để học viên học xong làm được ngay
        - list [ref=e72]:
          - listitem [ref=e73]:
            - generic [ref=e74]: 
            - text: Hơn 1000 bài tập và dự án thực tế
          - listitem [ref=e75]:
            - generic [ref=e76]: 
            - text: Công nghệ cập nhật mới nhất
          - listitem [ref=e77]:
            - generic [ref=e78]: 
            - text: Hình ảnh, ví dụ, bài giảng sinh động trực quan
          - listitem [ref=e79]:
            - generic [ref=e80]: 
            - text: Tư duy phân tích, giải quyết vấn đề trong dự án
          - listitem [ref=e81]:
            - generic [ref=e82]: 
            - text: Học tập kinh nghiệm, qui trình làm dự án, các qui chuẩn trong dự án
          - listitem [ref=e83]:
            - generic [ref=e84]: 
            - text: Cơ hội thực tập tại các công ty lớn như FPT, Microsoft
      - generic [ref=e86]:
        - heading "Lộ trình phù hợp" [level=3] [ref=e87]
        - list [ref=e88]:
          - listitem [ref=e89]:
            - generic [ref=e90]: 
            - text: Lộ trình bài bản từ zero tới chuyên nghiệp, nâng cao
          - listitem [ref=e91]:
            - generic [ref=e92]: 
            - text: Học, luyện tập code, kỹ thuật phân tích, soft skill
          - listitem [ref=e93]:
            - generic [ref=e94]: 
            - text: Huấn luyện để phát triển năng lực và niềm đam mê lập trình
      - generic [ref=e96]:
        - heading "Hệ thống học tập" [level=3] [ref=e97]
        - list [ref=e98]:
          - listitem [ref=e99]:
            - generic [ref=e100]: 
            - text: Tự động chấm điểm trắc nghiệm và đưa câu hỏi tùy theo mức độ học viên
          - listitem [ref=e101]:
            - generic [ref=e102]: 
            - text: Thống kê lượt xem video, làm bài, điểm số theo chu kỳ
          - listitem [ref=e103]:
            - generic [ref=e104]: 
            - text: Thống kê, so sánh khả năng học của các học viên cùng level để đưa ra mục tiêu học tập
      - generic [ref=e106]:
        - heading "Giảng viên" [level=3] [ref=e107]
        - list [ref=e108]:
          - listitem [ref=e109]:
            - generic [ref=e110]: 
            - text: Tương tác cùng mentor và giảng viên qua phần thảo luận
          - listitem [ref=e111]:
            - generic [ref=e112]: 
            - text: Review code và đưa ra các nhận xét góp ý
          - listitem [ref=e113]:
            - generic [ref=e114]: 
            - text: Chấm điểm tương tác thảo luận giữa các học viên
      - generic [ref=e116]:
        - heading "Chứng nhận" [level=3] [ref=e117]
        - list [ref=e118]:
          - listitem [ref=e119]:
            - generic [ref=e120]: 
            - text: Chấm bài và có thể vấn đáp trực tuyến để review
          - listitem [ref=e121]:
            - generic [ref=e122]: 
            - text: Hệ thống của chúng tôi cũng tạo ra cho bạn một CV trực tuyến độc đáo
          - listitem [ref=e123]:
            - generic [ref=e124]: 
            - text: Kết nối CV của bạn đến với các đối tác của V learning
    - heading "Khóa học phổ biến" [level=6] [ref=e126]:
      - link "Khóa học phổ biến" [ref=e127] [cursor=pointer]:
        - /url: ""
    - generic [ref=e128]:
      - link "Javascriptt12 Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e130] [cursor=pointer]:
        - /url: /chitiet/
        - generic [ref=e131]: Javascriptt12
        - generic [ref=e132]:
          - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e133]
          - generic [ref=e136]: Elon Musk
        - generic [ref=e137]:
          - generic [ref=e138]:
            - paragraph [ref=e139]:
              - text: "800.000"
              - superscript [ref=e140]: đ
            - paragraph [ref=e141]:
              - text: "400.000"
              - superscript [ref=e142]: đ
          - generic [ref=e143]:
            - generic [ref=e144]: 
            - text: 4.9(7840)
      - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e146] [cursor=pointer]:
        - /url: /chitiet/.100
        - generic [ref=e147]: Lập trình web
        - generic [ref=e148]:
          - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e149]
          - generic [ref=e152]: Elon Musk
        - generic [ref=e153]:
          - generic [ref=e154]:
            - paragraph [ref=e155]:
              - text: "800.000"
              - superscript [ref=e156]: đ
            - paragraph [ref=e157]:
              - text: "400.000"
              - superscript [ref=e158]: đ
          - generic [ref=e159]:
            - generic [ref=e160]: 
            - text: 4.9(7840)
      - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e162] [cursor=pointer]:
        - /url: /chitiet/000
        - generic [ref=e163]: Lập trình web
        - generic [ref=e164]:
          - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e165]
          - generic [ref=e168]: Elon Musk
        - generic [ref=e169]:
          - generic [ref=e170]:
            - paragraph [ref=e171]:
              - text: "800.000"
              - superscript [ref=e172]: đ
            - paragraph [ref=e173]:
              - text: "400.000"
              - superscript [ref=e174]: đ
          - generic [ref=e175]:
            - generic [ref=e176]: 
            - text: 4.9(7840)
      - link "Khóa học mới 2026 Lập trình hiện đang là xu hướng trên toàn thế giới... Elon Musk 800.000đ 400.000đ  4.9(7840)" [ref=e178] [cursor=pointer]:
        - /url: /chitiet/000123456
        - generic [ref=e179]: Khóa học mới 2026
        - generic [ref=e180]:
          - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e181]
          - generic [ref=e184]: Elon Musk
        - generic [ref=e185]:
          - generic [ref=e186]:
            - paragraph [ref=e187]:
              - text: "800.000"
              - superscript [ref=e188]: đ
            - paragraph [ref=e189]:
              - text: "400.000"
              - superscript [ref=e190]: đ
          - generic [ref=e191]:
            - generic [ref=e192]: 
            - text: 4.9(7840)
    - generic [ref=e193]:
      - heading "Khóa học tham khảo" [level=6] [ref=e194]:
        - link "Khóa học tham khảo" [ref=e195] [cursor=pointer]:
          - /url: ""
      - generic [ref=e196]:
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e198] [cursor=pointer]:
          - /url: /chitiet/09876788
          - generic [ref=e199]: Lập trình web
          - generic [ref=e200]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e201]
            - generic [ref=e202]:
              - generic [ref=e203]:
                - generic [ref=e204]: 
                - text: 8 giờ
              - generic [ref=e205]:
                - generic [ref=e206]: 
                - text: 4 tuần
              - generic [ref=e207]:
                - generic [ref=e208]: 
                - text: Tất cả
          - generic [ref=e209]:
            - generic [ref=e212]: Elon Musk
            - generic [ref=e213]:
              - paragraph [ref=e214]:
                - text: "800.000"
                - superscript [ref=e215]: đ
              - paragraph [ref=e216]:
                - text: "400.000"
                - superscript [ref=e217]: đ
                - generic [ref=e218]: 
          - generic [ref=e219]: Yêu thích
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e221] [cursor=pointer]:
          - /url: /chitiet/100999
          - generic [ref=e222]: Lập trình web
          - generic [ref=e223]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e224]
            - generic [ref=e225]:
              - generic [ref=e226]:
                - generic [ref=e227]: 
                - text: 8 giờ
              - generic [ref=e228]:
                - generic [ref=e229]: 
                - text: 4 tuần
              - generic [ref=e230]:
                - generic [ref=e231]: 
                - text: Tất cả
          - generic [ref=e232]:
            - generic [ref=e235]: Elon Musk
            - generic [ref=e236]:
              - paragraph [ref=e237]:
                - text: "800.000"
                - superscript [ref=e238]: đ
              - paragraph [ref=e239]:
                - text: "400.000"
                - superscript [ref=e240]: đ
                - generic [ref=e241]: 
          - generic [ref=e242]: Yêu thích
        - link "tai Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e244] [cursor=pointer]:
          - /url: /chitiet/1009991
          - generic [ref=e245]: tai
          - generic [ref=e246]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e247]
            - generic [ref=e248]:
              - generic [ref=e249]:
                - generic [ref=e250]: 
                - text: 8 giờ
              - generic [ref=e251]:
                - generic [ref=e252]: 
                - text: 4 tuần
              - generic [ref=e253]:
                - generic [ref=e254]: 
                - text: Tất cả
          - generic [ref=e255]:
            - generic [ref=e258]: Elon Musk
            - generic [ref=e259]:
              - paragraph [ref=e260]:
                - text: "800.000"
                - superscript [ref=e261]: đ
              - paragraph [ref=e262]:
                - text: "400.000"
                - superscript [ref=e263]: đ
                - generic [ref=e264]: 
          - generic [ref=e265]: Yêu thích
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e267] [cursor=pointer]:
          - /url: /chitiet/10099922
          - generic [ref=e268]: Lập trình web
          - generic [ref=e269]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e270]
            - generic [ref=e271]:
              - generic [ref=e272]:
                - generic [ref=e273]: 
                - text: 8 giờ
              - generic [ref=e274]:
                - generic [ref=e275]: 
                - text: 4 tuần
              - generic [ref=e276]:
                - generic [ref=e277]: 
                - text: Tất cả
          - generic [ref=e278]:
            - generic [ref=e281]: Elon Musk
            - generic [ref=e282]:
              - paragraph [ref=e283]:
                - text: "800.000"
                - superscript [ref=e284]: đ
              - paragraph [ref=e285]:
                - text: "400.000"
                - superscript [ref=e286]: đ
                - generic [ref=e287]: 
          - generic [ref=e288]: Yêu thích
    - generic [ref=e289]:
      - heading "Khóa học Front End React Js" [level=6] [ref=e290]:
        - link "Khóa học Front End React Js" [ref=e291] [cursor=pointer]:
          - /url: ""
      - generic [ref=e292]:
        - link "tai Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e294] [cursor=pointer]:
          - /url: /chitiet/1009991
          - generic [ref=e295]: tai
          - generic [ref=e296]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e297]
            - generic [ref=e298]:
              - generic [ref=e299]:
                - generic [ref=e300]: 
                - text: 8 giờ
              - generic [ref=e301]:
                - generic [ref=e302]: 
                - text: 4 tuần
              - generic [ref=e303]:
                - generic [ref=e304]: 
                - text: Tất cả
          - generic [ref=e305]:
            - generic [ref=e308]: Elon Musk
            - generic [ref=e309]:
              - paragraph [ref=e310]:
                - text: "800.000"
                - superscript [ref=e311]: đ
              - paragraph [ref=e312]:
                - text: "400.000"
                - superscript [ref=e313]: đ
                - generic [ref=e314]: 
          - generic [ref=e315]: Yêu thích
        - link "Lập trình web Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e317] [cursor=pointer]:
          - /url: /chitiet/10099922
          - generic [ref=e318]: Lập trình web
          - generic [ref=e319]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e320]
            - generic [ref=e321]:
              - generic [ref=e322]:
                - generic [ref=e323]: 
                - text: 8 giờ
              - generic [ref=e324]:
                - generic [ref=e325]: 
                - text: 4 tuần
              - generic [ref=e326]:
                - generic [ref=e327]: 
                - text: Tất cả
          - generic [ref=e328]:
            - generic [ref=e331]: Elon Musk
            - generic [ref=e332]:
              - paragraph [ref=e333]:
                - text: "800.000"
                - superscript [ref=e334]: đ
              - paragraph [ref=e335]:
                - text: "400.000"
                - superscript [ref=e336]: đ
                - generic [ref=e337]: 
          - generic [ref=e338]: Yêu thích
        - link "Doraemon Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e340] [cursor=pointer]:
          - /url: /chitiet/100999999
          - generic [ref=e341]: Doraemon
          - generic [ref=e342]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e343]
            - generic [ref=e344]:
              - generic [ref=e345]:
                - generic [ref=e346]: 
                - text: 8 giờ
              - generic [ref=e347]:
                - generic [ref=e348]: 
                - text: 4 tuần
              - generic [ref=e349]:
                - generic [ref=e350]: 
                - text: Tất cả
          - generic [ref=e351]:
            - generic [ref=e354]: Elon Musk
            - generic [ref=e355]:
              - paragraph [ref=e356]:
                - text: "800.000"
                - superscript [ref=e357]: đ
              - paragraph [ref=e358]:
                - text: "400.000"
                - superscript [ref=e359]: đ
                - generic [ref=e360]: 
          - generic [ref=e361]: Yêu thích
        - link "Toán Lập trình hiện đang là xu hướng trên toàn thế giới...  8 giờ  4 tuần  Tất cả Elon Musk 800.000đ 400.000đ  Yêu thích" [ref=e363] [cursor=pointer]:
          - /url: /chitiet/1111111111
          - generic [ref=e364]: Toán
          - generic [ref=e365]:
            - heading "Lập trình hiện đang là xu hướng trên toàn thế giới..." [level=6] [ref=e366]
            - generic [ref=e367]:
              - generic [ref=e368]:
                - generic [ref=e369]: 
                - text: 8 giờ
              - generic [ref=e370]:
                - generic [ref=e371]: 
                - text: 4 tuần
              - generic [ref=e372]:
                - generic [ref=e373]: 
                - text: Tất cả
          - generic [ref=e374]:
            - generic [ref=e377]: Elon Musk
            - generic [ref=e378]:
              - paragraph [ref=e379]:
                - text: "800.000"
                - superscript [ref=e380]: đ
              - paragraph [ref=e381]:
                - text: "400.000"
                - superscript [ref=e382]: đ
                - generic [ref=e383]: 
          - generic [ref=e384]: Yêu thích
  - generic [ref=e386]:
    - generic [ref=e388]:
      - generic [ref=e390]: "0"
      - paragraph [ref=e391]: Học viên
    - generic [ref=e393]:
      - generic [ref=e395]: "0"
      - paragraph [ref=e396]: Khóa học
    - generic [ref=e398]:
      - generic [ref=e400]: "0"
      - paragraph [ref=e401]: Giờ học
    - generic [ref=e403]:
      - generic [ref=e405]: "0"
      - paragraph [ref=e406]: Giảng viên
  - generic [ref=e407]:
    - heading "Giảng viên hàng đầu" [level=6] [ref=e408]:
      - link "Giảng viên hàng đầu" [ref=e409] [cursor=pointer]:
        - /url: ""
    - generic [ref=e411]:
      - generic [ref=e413]:
        - heading "Big DadMoon" [level=6] [ref=e414]
        - generic [ref=e415]:
          - paragraph [ref=e416]: Chuyên gia lĩnh vực
          - paragraph [ref=e417]: lập trình
        - paragraph [ref=e418]:
          - generic [ref=e419]: 
          - generic [ref=e420]: 
          - generic [ref=e421]: 
          - generic [ref=e422]: 
          - generic [ref=e423]: 
          - text: "4.9"
        - generic [ref=e424]: 100 Đánh giá
      - generic [ref=e426]:
        - heading "IcarDi MenBor" [level=6] [ref=e427]
        - generic [ref=e428]:
          - paragraph [ref=e429]: Chuyên gia ngôn ngữ
          - paragraph [ref=e430]: Vue Js
        - paragraph [ref=e431]:
          - generic [ref=e432]: 
          - generic [ref=e433]: 
          - generic [ref=e434]: 
          - generic [ref=e435]: 
          - generic [ref=e436]: 
          - text: "4.9"
        - generic [ref=e437]: 100 Đánh giá
      - generic [ref=e439]:
        - heading "Bladin Slaham" [level=6] [ref=e440]
        - generic [ref=e441]:
          - paragraph [ref=e442]: Chuyên gia hệ thống
          - paragraph [ref=e443]: máy tính
        - paragraph [ref=e444]:
          - generic [ref=e445]: 
          - generic [ref=e446]: 
          - generic [ref=e447]: 
          - generic [ref=e448]: 
          - generic [ref=e449]: 
          - text: "4.9"
        - generic [ref=e450]: 100 Đánh giá
      - generic [ref=e452]:
        - heading "Chris Andersan" [level=6] [ref=e453]
        - generic [ref=e454]:
          - paragraph [ref=e455]: Chuyên gia lĩnh vực
          - paragraph [ref=e456]: Full Skill
        - paragraph [ref=e457]:
          - generic [ref=e458]: 
          - generic [ref=e459]: 
          - generic [ref=e460]: 
          - generic [ref=e461]: 
          - generic [ref=e462]: 
          - text: "4.9"
        - generic [ref=e463]: 100 Đánh giá
      - generic [ref=e465]:
        - heading "VueLo Gadi" [level=6] [ref=e466]
        - generic [ref=e467]:
          - paragraph [ref=e468]: Chuyên gia lĩnh vực
          - paragraph [ref=e469]: Phân tích
        - paragraph [ref=e470]:
          - generic [ref=e471]: 
          - generic [ref=e472]: 
          - generic [ref=e473]: 
          - generic [ref=e474]: 
          - generic [ref=e475]: 
          - text: "4.9"
        - generic [ref=e476]: 100 Đánh giá
      - generic [ref=e478]:
        - heading "Hoàng Nam" [level=6] [ref=e479]
        - generic [ref=e480]:
          - paragraph [ref=e481]: Chuyên gia lĩnh vực
          - paragraph [ref=e482]: PHP
        - paragraph [ref=e483]:
          - generic [ref=e484]: 
          - generic [ref=e485]: 
          - generic [ref=e486]: 
          - generic [ref=e487]: 
          - generic [ref=e488]: 
          - text: "4.9"
        - generic [ref=e489]: 100 Đánh giá
      - generic [ref=e491]:
        - heading "David Ngô Savani" [level=6] [ref=e492]
        - generic [ref=e493]:
          - paragraph [ref=e494]: Chuyên gia lĩnh vực
          - paragraph [ref=e495]: Front End
        - paragraph [ref=e496]:
          - generic [ref=e497]: 
          - generic [ref=e498]: 
          - generic [ref=e499]: 
          - generic [ref=e500]: 
          - generic [ref=e501]: 
          - text: "4.9"
        - generic [ref=e502]: 100 Đánh giá
  - generic [ref=e517]:
    - blockquote [ref=e518]: Chương trình giảng dạy được biên soạn dành riêng cho các bạn Lập trình từ trái ngành hoặc đã có kiến thức theo cường độ cao, luôn được tinh chỉnh và tối ưu hóa theo thời gian bởi các thành viên sáng lập và giảng viên dày kinh nghiệm.Thực sự rất hay và hấp dẫn
    - paragraph [ref=e519]: Nhi Dev
    - text: Học viên xuất sắc
  - generic [ref=e520]:
    - generic [ref=e523]:
      - generic [ref=e524]:
        - link "V learning " [ref=e525] [cursor=pointer]:
          - /url: ""
          - text: V learning
          - generic [ref=e526]: 
        - list [ref=e527]:
          - listitem [ref=e528]:
            - generic [ref=e529]: 
            - text: 1800-123-4567
          - listitem [ref=e530]:
            - generic [ref=e531]: 
            - text: devit@gmail.com
          - listitem [ref=e532]:
            - generic [ref=e533]: 
            - text: Đà Nẵng
      - generic [ref=e534]:
        - heading "Liên kết" [level=3] [ref=e535]
        - list [ref=e536]:
          - listitem [ref=e537]:
            - generic [ref=e538]: 
            - text: Trang chủ
          - listitem [ref=e539]:
            - generic [ref=e540]: 
            - text: Dịch vụ
          - listitem [ref=e541]:
            - generic [ref=e542]: 
            - text: Nhóm
          - listitem [ref=e543]:
            - generic [ref=e544]: 
            - text: Blog
      - generic [ref=e545]:
        - heading "Khóa học" [level=3] [ref=e546]
        - list [ref=e547]:
          - listitem [ref=e548]:
            - generic [ref=e549]: 
            - text: Front End
          - listitem [ref=e550]:
            - generic [ref=e551]: 
            - text: Back End
          - listitem [ref=e552]:
            - generic [ref=e553]: 
            - text: Full stack
          - listitem [ref=e554]:
            - generic [ref=e555]: 
            - text: Node Js
      - generic [ref=e556]:
        - heading "Đăng kí tư vấn" [level=3] [ref=e557]
        - generic [ref=e558]:
          - textbox "Họ và tên" [ref=e559]
          - textbox "Email" [ref=e560]
          - textbox "Số điện thoại" [ref=e561]
        - button "Đăng kí" [ref=e562] [cursor=pointer]
    - generic [ref=e563]:
      - paragraph [ref=e565]: Copyright © 2021. All rights reserved.
      - generic [ref=e566]:
        - generic [ref=e567]: 
        - generic [ref=e568]: 
        - generic [ref=e569]: 
```

# Test source

```ts
  1  | import { expect, type Page } from '@playwright/test';
  2  | import { BasePage } from '../../basePage/basePage.index';
  3  | import { HomePageUiEndpoint } from '../../../endpoints/ui-endpoints/homePage.ui.endpoint';
  4  | import { HomeHeaderHomePageButton } from './homeHeaderHomePage.button';
  5  | import type { Header, HomeHeaderExpectedUrl } from './homeHeaderHomePage.type';
  6  | 
  7  | export class HomeHeaderHomePage extends BasePage {
  8  |   readonly button: HomeHeaderHomePageButton;
  9  | 
  10 |   constructor(page: Page) {
  11 |     super(page);
  12 | 
  13 |     this.button = new HomeHeaderHomePageButton(page);
  14 |   }
  15 | 
  16 |   async gotoBaseUrl(): Promise<void> {
  17 |     await this.goto('/');
  18 |   }
  19 | 
  20 |   async gotoHomePage(): Promise<void> {
  21 |     await this.goto(HomePageUiEndpoint.homePage);
  22 |   }
  23 | 
  24 |   async gotoUserManagementPage(): Promise<void> {
  25 |     await this.goto(HomePageUiEndpoint.userManagement);
  26 |   }
  27 | 
  28 |   async clickHomeIcon(): Promise<void> {
  29 |     await this.click(this.button.homeIcon);
  30 |   }
  31 | 
  32 |   async clickHeaderLink(header: Header): Promise<void> {
  33 |     await this.click(this.button.headerLink(header));
  34 |   }
  35 | 
  36 |   async hoverHeaderLink(header: Header): Promise<void> {
  37 |     await this.hover(this.button.headerLink(header));
  38 |   }
  39 | 
  40 |   async hoverAvatarIcon(): Promise<void> {
  41 |   await this.hover(this.button.avatarIcon);
  42 | 
  43 |   await expect(this.button.logoutButton).toBeVisible();
  44 | 
  45 |   await expect
  46 |     .poll(
  47 |       async () => {
  48 |         const avatarBox = await this.button.avatarIcon.boundingBox();
  49 |         const logoutBox = await this.button.logoutButton.boundingBox();
  50 | 
  51 |         if (!avatarBox || !logoutBox) {
  52 |           return false;
  53 |         }
  54 | 
  55 |         const isOverlapping =
  56 |           logoutBox.x < avatarBox.x + avatarBox.width &&
  57 |           logoutBox.x + logoutBox.width > avatarBox.x &&
  58 |           logoutBox.y < avatarBox.y + avatarBox.height &&
  59 |           logoutBox.y + logoutBox.height > avatarBox.y;
  60 | 
  61 |         return !isOverlapping;
  62 |       },
  63 |       {
  64 |         timeout: 5000,
  65 |         message: 'Wait until logout button is not overlapped with avatar icon'
  66 |       }
  67 |     )
> 68 |     .toBe(true);
     |      ^ Error: Wait until logout button is not overlapped with avatar icon
  69 | }
  70 | 
  71 |   async clickLogoutButton(): Promise<void> {
  72 |     await this.click(this.button.logoutButton);
  73 |   }
  74 | 
  75 |   async expectHomePageLoaded(
  76 |     expected: HomeHeaderExpectedUrl = {
  77 |       homePageUrl: HomePageUiEndpoint.homePage
  78 |     }
  79 |   ): Promise<void> {
  80 |     await this.waitForUrl(expected.homePageUrl);
  81 |     await expect(this.page).toHaveURL(expected.homePageUrl);
  82 |   }
  83 | }
```