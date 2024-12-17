"use client";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lecture } from "@/types/lectures";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { useGetLecturesByChapter } from "@/queries/useLecture";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useCreateQuiz, useDeleteQuizById } from "@/queries/useQuizzes";
import { toast } from "react-toastify";

const formSchema = z.object({
  lecture_id: z.string(),
});

const intitialQuestions = [
  {
    question: "",
    correct_option_id: "",
    options: [
      {
        correct_answer: "",
        option_id: "",
      },
    ],
  },
];

export default function Page() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const searchParams = useGetSearchParams();
  const createQuizMutation = useCreateQuiz();
  const [questions, setQuestions] = useState(intitialQuestions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lecture_id: "",
    },
  });

  const { data } = useGetLecturesByChapter(searchParams.chapter_id, {
    enabled: searchParams.chapter_id !== undefined,
  });

  const lectures = ((data as any)?.payload?.result as Lecture[]) || [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      lecture_id: values.lecture_id,
      questions,
      chapter_id: searchParams.chapter_id,
    };
    createQuizMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.payload.message);
        form.reset();
        setQuestions(intitialQuestions);
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  }

  const addOption = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, index) =>
        index === questionIndex
          ? {
              ...q,
              options: [...q.options, { correct_answer: "", option_id: "" }],
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        correct_option_id: "",
        options: [
          {
            correct_answer: "",
            option_id: "",
          },
        ],
      },
    ]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="lecture_id"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Chọn bài giảng</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
                        {value ? lectures.find((lecture) => lecture.title === value)?.title : "Tìm kiếm..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy kết quả nào.</CommandEmpty>
                          <CommandGroup>
                            {lectures.map((lecture) => (
                              <CommandItem
                                key={lecture._id}
                                value={lecture.title}
                                onSelect={(currentValue) => {
                                  setValue(currentValue === value ? "" : currentValue);
                                  form.setValue("lecture_id", lecture._id);
                                  setOpen(false);
                                }}
                              >
                                {lecture.title}
                                <Check
                                  className={cn("ml-auto", value === lecture.title ? "opacity-100" : "opacity-0")}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-5">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="border p-4 rounded mb-4">
              <Input
                placeholder={`Câu hỏi ${questionIndex + 1}`}
                value={question.question}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((q, index) => (index === questionIndex ? { ...q, question: e.target.value } : q))
                  )
                }
                className="mb-3"
              />
              <Input
                placeholder="ID đáp án đúng"
                value={question.correct_option_id}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((q, index) => (index === questionIndex ? { ...q, correct_option_id: e.target.value } : q))
                  )
                }
                className="mb-3"
              />
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-4 items-center mb-2">
                  <Input
                    placeholder="Đáp án"
                    value={option.correct_answer}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((q, index) =>
                          index === questionIndex
                            ? {
                                ...q,
                                options: q.options.map((opt, i) =>
                                  i === optionIndex ? { ...opt, correct_answer: e.target.value } : opt
                                ),
                              }
                            : q
                        )
                      )
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="ID"
                    value={option.option_id}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((q, index) =>
                          index === questionIndex
                            ? {
                                ...q,
                                options: q.options.map((opt, i) =>
                                  i === optionIndex ? { ...opt, option_id: e.target.value } : opt
                                ),
                              }
                            : q
                        )
                      )
                    }
                    className="flex-1"
                  />
                </div>
              ))}
              <Button type="button" onClick={() => addOption(questionIndex)} className="mt-3">
                Thêm đáp án
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <Button type="button" onClick={addQuestion} className="mt-5">
            Thêm câu hỏi mới
          </Button>
          <Button type="submit" className="mt-5">
            Gửi
          </Button>
        </div>
      </form>
    </Form>
  );
}
