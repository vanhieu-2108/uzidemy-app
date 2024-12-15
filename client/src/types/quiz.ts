import { Lecture } from "@/types/lectures";

export interface Quiz {
  _id: string;
  chapter_id: string;
  user_id: string;
  lecture_id: string;
  _destroy: boolean;
  lecture: Lecture;
  questions: [
    {
      question: string;
      correct_option_id: string;
      options: [
        {
          correct_answer: string;
          option_id: string;
        }
      ];
    }
  ];
}
