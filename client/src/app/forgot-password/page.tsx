"use client";
import { useRouter, useSearchParams } from "next/navigation"; // Đảm bảo bạn import từ next/navigation

import { useEffect, useState } from "react";
import EmailForm from "./components/email-form";
import VerificationForm from "./components/verification-form";
import ResetPasswordForm from "./components/reset-password-form";
import SuccessMessage from "./components/success-message";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams(); // Lấy các tham số truy vấn
  const [step, setStep] = useState<string | null>(null);

  useEffect(() => {
    const stepParam = searchParams.get("step"); // Lấy giá trị step từ query
    setStep(stepParam); // Cập nhật state chỉ khi có giá trị
  }, [searchParams]);

  let content;

  switch (step) {
    case "verification":
      content = <VerificationForm />;
      break;
    case "reset-password":
      content = <ResetPasswordForm />;
      break;
    case "success":
      content = <SuccessMessage />;
      break;
    default: // Mặc định là form nhập email
      content = <EmailForm />;
      break;
  }

  return <div>{content}</div>;
}
