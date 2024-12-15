export interface Progress {
  _id: string;
  user_id: string;
  lecture_id: string;
  is_watched: boolean;
  created_at: string;
  course_id: string;
}

export interface DataGetProgressByCourseId {
  progressPercentage: number;
  totalLectures: number;
  watchedLectures: Progress[];
}
