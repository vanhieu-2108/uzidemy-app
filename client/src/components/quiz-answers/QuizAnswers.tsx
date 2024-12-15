"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizAnswer {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
}

interface QuizAnswersProps {
  answers: QuizAnswer[];
}

export default function QuizAnswers({ answers }: QuizAnswersProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        {answers.map((answer, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Separator className="my-6" />}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{`Question ${index + 1}`}</h3>
              <p className="text-gray-700 dark:text-gray-300">{answer.question}</p>
              <RadioGroup defaultValue={answer.userAnswer} className="space-y-2">
                {answer.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center">
                    <div className="flex items-center w-full">
                      <RadioGroupItem
                        value={option}
                        id={`q${index}-option${optionIndex}`}
                        disabled
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`q${index}-option${optionIndex}`}
                        className={`flex items-center w-full p-4 border rounded-lg cursor-pointer transition-colors
                          ${
                            option === answer.correctAnswer
                              ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          }
                          ${
                            option === answer.userAnswer && option !== answer.correctAnswer
                              ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }
                          peer-checked:border-primary peer-checked:bg-primary/10
                          hover:bg-gray-50 dark:hover:bg-gray-800`}
                      >
                        <div
                          className="flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 flex-shrink-0
                          ${option === answer.userAnswer ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}"
                        >
                          {option === answer.userAnswer && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="flex-grow">{option}</span>
                        {option === answer.userAnswer && option === answer.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                        )}
                        {option === answer.userAnswer && option !== answer.correctAnswer && (
                          <XCircle className="w-5 h-5 text-red-500 ml-2" />
                        )}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
