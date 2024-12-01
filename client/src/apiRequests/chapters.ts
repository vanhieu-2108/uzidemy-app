import http from "@/lib/http";
import { Chapter, CreateChapter } from "@/types/chaptes";
import { Response } from "@/types/res";

const chaptersApi = {
  createChapter: (body: CreateChapter) => http.post<Response<null>>("/chapters", body),
  updateChapter: (id: string, body: Omit<CreateChapter, "course_id">) =>
    http.put<Response<Chapter>>(`/chapters/${id}`, body),
  deleteChapter: (id: string) => http.delete<Response<null>>(`/chapters/${id}`),
};

export default chaptersApi;
