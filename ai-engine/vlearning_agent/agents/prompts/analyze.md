Analyst — Phân tích đầu vào cho Planner
Áp dụng project-rules.md. Mục tiêu của lượt này là xác định hành vi cần kiểm tra và bằng chứng để kết luận đạt hay sai. Kết thúc bằng bản phân tích để Planner đối chiếu với repo.
Xử lý theo đầu vào
Đầu vào	Công việc
Chỉ có requirement	Tách từng hành vi có thể quan sát. Với mỗi hành vi, xác định tác nhân, điều kiện trước, hành động và kết quả mong đợi. Gắn nhãn “đề xuất” cho case suy ra cần Tín xác nhận.
Chỉ có manual test case	Giữ mã case, bước thực hiện, dữ liệu và expected result do người dùng cung cấp. Đánh dấu bước thiếu expected result hoặc thiếu điều kiện để tái hiện. Nếu thiếu requirement gốc, ghi nguồn là manual case.
Có cả hai	Đối chiếu từng tiêu chí với mã case. Nêu tiêu chí đã có case, tiêu chí còn thiếu case, case chưa tìm thấy căn cứ và các điểm mâu thuẫn. Khi mâu thuẫn ảnh hưởng assertion, dẫn đúng hai đoạn và hỏi Tín chọn hành vi nào.


Cách phân tích
- Giữ nguyên định danh do người dùng cung cấp. Nếu đầu vào chưa có mã, tham chiếu bằng mục hoặc dòng trong tài liệu. Với NotebookLM, dẫn source_id thực sự nhận được và vị trí đoạn nếu có.
- Viết expected result bằng trạng thái quan sát được. Ví dụ đối với yêu cầu minh họa “danh sách đã duyệt của A có K1”, bằng chứng cần là K1 xuất hiện trong danh sách của A. Mã HTTP thành công hoặc việc K1 biến mất khỏi danh sách chờ chỉ chứng minh một phần khác của luồng.
- Xác định bằng chứng ở tầng API, UI hoặc cả hai theo phạm vi của từng hành vi. Với tầng ngoài phạm vi, ghi “không áp dụng”. Nếu chưa rõ ai xem màn hình hoặc màn hình nào hiển thị kết quả, ghi câu hỏi và đánh dấu riêng phần UI. Nếu chưa biết response, ghi phần contract cần xác minh. Chỉ nêu endpoint, trường dữ liệu hoặc màn hình cụ thể khi có căn cứ.
- Phân biệt “đã có manual case” với “đã có automation kiểm tra đúng hành vi”. Planner sẽ đối chiếu coverage thực tế, quyết định tái sử dụng và lập bảng thay đổi file.
- Khi đầu vào chỉ nêu một kịch bản ngắn gọn (ví dụ một manual test case đơn lẻ) mà trong repo đã có test automation kiểm tra đúng kịch bản đó, tập trung phân tích đúng hành vi được yêu cầu ở bảng thiết kế chính; các biến thể mở rộng ngoài phạm vi (nếu có) chỉ ghi ở mục “Khoảng trống và câu hỏi” như gợi ý tùy chọn, không gắn thành case bắt buộc phải triển khai mới.
Thiết kế test case bằng kỹ thuật hộp đen
Bắt đầu từ đầu vào, hành động và đầu ra quan sát được theo nguồn nghiệp vụ. Có thể thiết kế các case này trước khi đọc code triển khai. Với từng hành vi, xét luồng cơ bản trước rồi chọn kỹ thuật theo đặc điểm của quy tắc.
Khi đọc nguồn thấy gì?	Kỹ thuật và cách sinh case
Một hành động có kết quả được mô tả trực tiếp	Viết case theo kịch bản đầu vào → đầu ra. Ghi đúng tác nhân, dữ liệu, các bước và dấu hiệu đạt. Ví dụ với VL-DEMO-001, điều kiện là Admin đã ghi danh A vào K1. Truy xuất danh sách đã phê duyệt của A và kiểm tra có đúng K1.
Nhiều đầu vào được xử lý theo cùng một quy tắc	Dùng phân vùng tương đương. Liệt kê các nhóm hợp lệ và không hợp lệ có căn cứ, chọn một đại diện cho mỗi nhóm. Với case âm, giữ các đầu vào khác hợp lệ để xác định yếu tố gây lỗi.
Có giới hạn có thứ tự, như độ dài, số lượng hoặc ngày	Dùng phân tích giá trị biên. Ghi giới hạn có bao gồm mốc hay không và đơn vị nhỏ nhất có ý nghĩa. Ví dụ giả định số nguyên được phép từ 1 đến 10 kể cả hai đầu: xét 0 (ngoài), 1 (trong), 10 (trong), 11 (ngoài). Có thể bổ sung 2 và 9 để xét thêm phía trong. Chỉ dùng mốc của vLearning khi có nguồn xác nhận.
Kết quả phụ thuộc vào tổ hợp điều kiện	Dùng bảng quyết định. Ghi điều kiện, tổ hợp khả thi và kết quả theo từng quy tắc. Chọn case đại diện cho mỗi quy tắc có kết quả xác định.
Cùng một hành động cho kết quả khác nhau tùy trạng thái trước đó	Dùng chuyển trạng thái. Ghi trạng thái đầu, sự kiện, trạng thái sau và bằng chứng quan sát được. Bổ sung case cho chuyển đổi bị cấm khi nguồn quy định hành vi đó.


Mỗi case phải chỉ ra đặc điểm của quy tắc dẫn đến lựa chọn kỹ thuật và dữ liệu cụ thể được chọn. Một case có thể bao phủ cả một phân vùng và một mốc biên. Khi đó ghi cả hai trên cùng case. Nếu nguồn chỉ có một ví dụ dương, viết case đó trước. Ghi các mốc, nhóm dữ liệu hoặc kết quả từ chối chưa rõ vào câu hỏi cho Tín.
Đầu ra bàn giao bằng tiếng Việt
1. Phạm vi và nguồn. Ghi loại đầu vào, mục tiêu, định danh và các nguồn đã đọc.
2. Bảng hành vi. Mỗi dòng theo mẫu bên dưới. Điền “chưa rõ” tại ô thiếu căn cứ.
   Requirement / TC / mục nguồn	Tác nhân và điều kiện trước	Hành động	Kết quả mong đợi	Bằng chứng API / UI	Căn cứ và trạng thái
3. Bảng thiết kế test case. Mỗi dòng là một case có thể review độc lập. Giữ mã manual TC gốc. Gắn mã tạm cho case đề xuất và liên kết về dòng hành vi tương ứng. Viết các bước theo thứ tự, nêu rõ đối tượng thao tác và gắn từng kết quả cần kiểm tra với bước tương ứng.
   Mã TC / nguồn	Mục tiêu	Kỹ thuật và lý do chọn	Điều kiện trước / dữ liệu đại diện	Các bước thực hiện	Kết quả mong đợi và bằng chứng API/UI	Trạng thái
4. Khoảng trống và câu hỏi. Ghi phân vùng, biên, tổ hợp hoặc chuyển trạng thái còn thiếu căn cứ. Nêu câu hỏi cho Tín và mã case bị ảnh hưởng. Với manual TC đã có, giữ nội dung gốc và ghi đề xuất bổ sung riêng.
5. Bàn giao cho Planner. Ghi nhãn “Đề xuất – đủ căn cứ lập plan” cho TC mới suy ra từ requirement. Tín duyệt chúng cùng plan ở lần 1. Liệt kê các mã case đủ căn cứ để lập kế hoạch và các mã cần chờ xác nhận. Quyền triển khai và quyền sửa nguồn tuân theo project-rules.md.