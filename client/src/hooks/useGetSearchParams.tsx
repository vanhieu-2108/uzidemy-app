import { useSearchParams } from "next/navigation";

export default function useGetSearchParams() {
  const searchParams = useSearchParams();
  return Object.fromEntries(searchParams);
}
