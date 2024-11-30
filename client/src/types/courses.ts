import { Chapter } from "@/types/chaptes";
import { Lecture } from "@/types/lectures";

export interface Course {
  _id: string;
  slug: string;
  title: string;
  description: string;
  original_price: number;
  sale_price: number;
  chapters: Chapter[];
  image: string;
  view_count: number;
  benefits: string[];
  requirements: string[];
  faqs: Faq[];
  created_at: string;
  updated_at: string;
  status: string;
}

export type UpdateCourse = Omit<Course, "created_at" | "updated_at" | "status" | "chapters">;

export interface Pagination {
  page: number;
  limit: number;
  total_page: number;
}

export interface ResultCourses {
  data: Course[];
  pagination: Pagination;
}

export interface ResultUploadImage {
  url: string;
  type: number;
}

export type ResultUploadVideo = ResultUploadImage;

export type AddCourse = Pick<Course, "slug" | "title" | "description" | "original_price" | "sale_price" | "image">;

export type ResultAddCourse = {
  message: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type CoursesContent = {
  _id: string;
  title: string;
  course_id: string;
  lectures: Lecture[] & {
    _destroy: boolean;
    next_lecture_id: string | null;
    prev_lecture_id: string | null;
  };
};
