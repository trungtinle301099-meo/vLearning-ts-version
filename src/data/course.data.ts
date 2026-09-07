import { env } from '../config/env.config';
import { randomHelper } from '../helpers/random.helper';
import type { CreateCourseRequest } from '../types/course.type';

export function createRandomCourseData(
  override: Partial<CreateCourseRequest> = {}
): CreateCourseRequest {
  const courseId = randomHelper.courseId();

  return {
    maKhoaHoc: courseId,
    biDanh: randomHelper.courseAlias(courseId),
    tenKhoaHoc: randomHelper.courseName(),
    moTa: randomHelper.courseDescription(),
    luotXem: randomHelper.number(1, 100),
    danhGia: randomHelper.number(1, 10),
    hinhAnh: 'https://elearningnew.cybersoft.edu.vn/hinhanh/tai.jpg',
    maNhom: env.defaultGroup,
    ngayTao: randomHelper.futureDateVN(),
    maDanhMucKhoaHoc: 'BackEnd',
    taiKhoanNguoiTao: env.username,
    ...override
  };
}

