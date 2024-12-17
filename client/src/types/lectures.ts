export interface Lecture {
  _id: string;
  slug: string;
  title: string;
  video_url: string;
  content: string;
  course_id: string;
  chapter_id: string;
  _destroy?: boolean;
}
