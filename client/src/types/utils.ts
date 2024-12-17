import { UseQueryOptions } from "@tanstack/react-query";

export type TQueryOptions<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;
