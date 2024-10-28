import { useState } from "react";

export const useUserProfile = () => {
  const [user, setUser] = useState({ name: "", age: 0 });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};
  return { user, handleChange, handleSubmit };
};
