"use client";
import { useGetCourse, useUpdateCourse, useUploadImage } from "@/queries/useCourses";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import useDynamicFieldArray from "@/hooks/useDynamicFieldArray";
import { Faq } from "@/types/courses";
import { toast } from "react-toastify";

const formSchema = z.object({
  slug: z.string().nonempty("Đường dẫn không được để trống"),
  title: z.string().nonempty("Tiêu đề không được để trống"),
  description: z.string().nonempty("Mô tả không được để trống"),
  original_price: z.coerce.number().positive("Giá gốc phải lớn hơn 0"),
  sale_price: z.coerce.number().positive("Giá bán phải lớn hơn 0"),
  image: z.string().url().optional(),
  benefits: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      })
    )
    .optional(),
  _id: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function Page({ params }: { params: { id: string } }) {
  const { data } = useGetCourse(params.id);
  const [file, setFile] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [editor, setEditor] = useState("");
  const [faqs, setFAQs] = useState<Faq[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      original_price: 0,
      sale_price: 0,
      image: "",
      benefits: [],
      requirements: [],
      faqs: [],
      _id: "",
    },
  });
  const {
    addField: addBenefitField,
    fields: benefits,
    removeField: removeBenefitField,
    updateField: updateBenefitField,
    setFields: setBenefits,
  } = useDynamicFieldArray<FormData>(form, "benefits");
  const uploadImageMutation = useUploadImage();
  const updateCourseMutation = useUpdateCourse();

  const onSubmit = async (values: FormData) => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file as Blob);
      const resImage = await uploadImageMutation.mutateAsync(formData);
      updateCourseMutation.mutate(
        {
          ...values,
          image: resImage.payload.result[0].url,
        } as any,
        {
          onSuccess: (data) => {
            toast.success(data.payload.message);
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );
    } else {
      updateCourseMutation.mutate(values as any, {
        onSuccess: (data) => {
          toast.success(data.payload.message);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  };

  const {
    addField: addRequirementField,
    fields: requirements,
    removeField: removeRequirementField,
    updateField: updateRequirementField,
    setFields: setRequirements,
  } = useDynamicFieldArray<FormData>(form, "requirements");

  useEffect(() => {
    if (data && data.payload.result) {
      const {
        slug,
        title,
        description,
        original_price,
        sale_price,
        image,
        _id,
        benefits,
        requirements,
        faqs, // Make sure to destructure faqs and requirements
      } = data.payload.result;

      // Set form values
      form.setValue("slug", slug);
      form.setValue("title", title);
      form.setValue("description", description);
      form.setValue("original_price", original_price);
      form.setValue("sale_price", sale_price);
      form.setValue("image", image);
      form.setValue("benefits", benefits);
      form.setValue("requirements", requirements || []); // Ensure requirements is an empty array if undefined
      form.setValue("_id", _id);

      setFAQs(faqs || []);
      form.setValue("faqs", faqs || []);

      setBenefits(benefits || []);
      form.setValue("benefits", benefits || []);

      setRequirements(requirements || []);
      form.setValue("requirements", requirements || []);

      // If description is available, set the editor state
      setEditor(description);
    }
  }, [data?.payload.result, form]);

  const addFAQField = () => {
    setFAQs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const updateFAQField = (index: number, value: Faq) => {
    setFAQs((prev) => {
      const updatedFAQs = [...prev];
      updatedFAQs[index] = value;
      return updatedFAQs;
    });
  };

  const removeFAQField = (index: number) => {
    setFAQs((prev) => {
      const updatedFAQs = [...prev];
      updatedFAQs.splice(index, 1);
      return updatedFAQs;
    });
  };

  useEffect(() => {
    form.setValue("faqs", faqs);
  }, [faqs, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => console.log("error", error))}
        className="space-y-8 pt-8 pb-16"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Enter your title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="original_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá gốc</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your original price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá bán</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your sale price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh</FormLabel>
                <div className="flex items-center justify-center w-full">
                  {!Boolean(file) && !form.getValues("image") && (
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64  border-gray-300 border rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        ref={imageRef}
                        onChange={(e) => {
                          if (e.target.files) {
                            setFile(e.target.files[0]);
                            form.setValue("image", URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </label>
                  )}
                  {(file || form.getValues("image")) && (
                    <div className="flex relative flex-col items-center justify-center w-full h-64  border-gray-300 border rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <Image
                        src={file ? URL.createObjectURL(file) : form.getValues("image") ?? ""}
                        alt="image"
                        fill
                        className="object-contain"
                      />
                      <Button
                        className="absolute top-2 right-2"
                        variant={"destructive"}
                        onClick={() => {
                          setFile(null);
                          form.setValue("image", "");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <div>
                  <MDEditor
                    value={editor}
                    onChange={(value) => {
                      setEditor(value || "");
                      form.setValue("description", value || "");
                    }}
                  />
                  <MDEditor.Markdown style={{ whiteSpace: "pre-wrap" }} source={editor} className="hidden" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="benefits"
            render={() => (
              <FormItem>
                <FormLabel>Lợi ích</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Input
                          placeholder={`Lợi ích ${index + 1}`}
                          value={benefit}
                          onChange={(e) => updateBenefitField(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeBenefitField(index)}
                          disabled={benefits.length === 1}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <Button type="button" className="mt-4" onClick={addBenefitField}>
                  +
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requirements"
            render={() => (
              <FormItem>
                <FormLabel>Bắt buộc</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {requirements.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Input
                          placeholder={`Bắt buộc ${index + 1}`}
                          value={benefit}
                          onChange={(e) => updateRequirementField(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeRequirementField(index)}
                          disabled={requirements.length === 1}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <Button type="button" className="mt-4" onClick={addRequirementField}>
                  +
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="faqs"
          render={() => (
            <FormItem>
              <FormLabel>Câu hỏi thường gặp (FAQs)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <Input
                        placeholder={`Câu hỏi ${index + 1}`}
                        value={faq?.question || ""}
                        onChange={(e) =>
                          updateFAQField(index, {
                            ...faq,
                            question: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder={`Câu trả lời ${index + 1}`}
                        value={faq?.answer || ""}
                        onChange={(e) =>
                          updateFAQField(index, {
                            ...faq,
                            answer: e.target.value,
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeFAQField(index)}
                        className="col-span-1 md:col-span-2 w-max"
                        disabled={faqs.length === 1}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>
              </FormControl>
              <Button type="button" className="mt-4" onClick={addFAQField}>
                +
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12">
          Submit
        </Button>
      </form>
    </Form>
  );
}
