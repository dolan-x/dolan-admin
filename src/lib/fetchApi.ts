import { $fetch } from "ohmyfetch";

import { DOLAN_TOKEN } from "~/constants";

export type DolanResponse<T> =
  | { success: true; code: number; message: string; data: T; meta: Record<string, any> }
  | { success: false; code: number; message: string; error: string };
export type DolanResponseP<T> = Promise<DolanResponse<T>>;

const f = $fetch.create({
  baseURL: import.meta.env.VITE_DOLAN_API_URL,
});
export async function fetchApi<T=any>(url: Parameters<typeof f>[0], args?: Parameters<typeof f>[1]): DolanResponseP<T> {
  return f(url, {
    ...args,
    headers: {
      Authorization: localStorage.getItem(DOLAN_TOKEN) ? `Bearer ${localStorage.getItem(DOLAN_TOKEN)}` : "",
      ...(args?.headers || {}),
    },
  });
}
