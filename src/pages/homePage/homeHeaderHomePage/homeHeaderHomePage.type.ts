export type HomeHeaderExpectedUrl = {
  homePageUrl: string | RegExp;
};

export type Header = 'Danh mục' | 'Blog' | 'Thông tin' | 'Khóa học' | 'Sự kiện';

export type CourseCategory =
  | 'Thiết kế Web'
  | 'Lập trình Backend'
  | 'Lập trình di động'
  | 'Lập trình Front end'
  | 'Lập trình Full Stack'
  | 'Tư duy lập trình';

export type EventCategory =
  | 'Sự kiện Sale Cuối Năm'
  | 'Sự kiện Giáng sinh'
  | 'Sự kiện Noel';