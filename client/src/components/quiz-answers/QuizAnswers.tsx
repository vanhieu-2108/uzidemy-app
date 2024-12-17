"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCheckQuizAnswer, useGetQuizzesByLectureId } from "@/queries/useQuizzes";
import { toast } from "react-toastify";

interface QuizAnswersProps {
  lecture_id: string;
}

export default function QuizAnswers({ lecture_id }: QuizAnswersProps) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data: resData, isLoading } = useGetQuizzesByLectureId(lecture_id);
  const quizzes = resData?.payload?.result || [];
  const checkAnswerMutation = useCheckQuizAnswer();

  const currentQuiz = quizzes[currentQuizIndex];
  const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setCurrentQuestionIndex(0);
    }
    setSelectedOption(null);
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setCurrentQuestionIndex(quizzes[currentQuizIndex - 1].questions.length - 1);
    }
    setSelectedOption(null);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) {
      return;
    }

    const payload = {
      quiz_id: currentQuiz._id,
      question_index: currentQuestionIndex,
      selected_option_id: selectedOption,
    };

    checkAnswerMutation.mutate(payload, {
      onSuccess: (data) => {
        if (data.payload.result.isCorrect) {
          toast.success(data.payload.message);
        } else {
          toast.error(data.payload.message);
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  if (isLoading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (quizzes.length === 0) {
    return <p>Không có câu hỏi nào.</p>;
  }

  if (!currentQuestion) {
    return <p>Không tìm thấy câu hỏi hiện tại.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Bài kiểm tra</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{`Câu hỏi ${currentQuestionIndex + 1} (Bài ${
            currentQuizIndex + 1
          })`}</h3>
          <p className="text-gray-700 dark:text-gray-300">{currentQuestion.question}</p>
          <RadioGroup
            className="space-y-2"
            value={selectedOption || ""}
            onValueChange={(value) => setSelectedOption(value)}
          >
            {currentQuestion.options.map((option, optionIndex) => (
              <div className="flex items-center space-x-2" key={optionIndex}>
                <RadioGroupItem value={option.option_id} id={`option-${option.option_id}`} />
                <Label htmlFor={`option-${option.option_id}`}>{option.correct_answer}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuizIndex === 0 && currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button onClick={handleSubmitAnswer} className="px-4 py-2 bg-green-500 text-white rounded-md">
            Submit
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentQuizIndex === quizzes.length - 1 && currentQuestionIndex === currentQuiz.questions.length - 1
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
