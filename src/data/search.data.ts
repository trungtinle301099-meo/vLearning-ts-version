export const SEARCH_KEYWORD = {
  // TC-SRCH-001: keyword hợp lệ chung, và TC-SRCH-040: dùng khi giả lập API lỗi.
  valid: 'khóa học',
 
  // TC-SRCH-002 (Enter), 006 (trim), 008 (hoa/thường), 053 (reload).
  javascript: 'Javascript',
 
  // TC-SRCH-007: tiếng Việt có dấu, kiểm tra không lỗi mã hóa Unicode.
  vietnamese: 'lập trình',
 
  // TC-SRCH-009: ký tự đặc biệt + thẻ script (kiểm tra XSS cơ bản).
  specialCharacters: '@#$%^<script>',
 
  // TC-SRCH-010: biên dưới, keyword chỉ 1 ký tự.
  singleCharacter: 'a'
};
 
// TC-SRCH-006: tạo keyword có 3 khoảng trắng ở đầu và cuối, vd "   Javascript   ".
// Viết thành hàm để dùng lại cho keyword khác, giống các hàm create... trong user.data.ts.
export const createKeywordWithSpaces = (keyword: string): string => `   ${keyword}   `;
 
// TODO: thay bằng URL thật của trang kết quả.
// Cách lấy: search thử 1 lần, nhìn thanh địa chỉ (vd .../timkiem/javascript) rồi sửa regex cho khớp.
export const SEARCH_RESULT_URL = /timkiem|search/i;
 