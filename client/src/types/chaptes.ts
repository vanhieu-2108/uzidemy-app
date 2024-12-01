export interface Chapter {
  _id: string;
  title: string;
  course_id: string;
  lectures: string[];
  _destroy: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateChapter {
  title: string;
  course_id: string;
}
