import { $fetch } from "ohmyfetch";

import { DOLAN_TOKEN } from "~/constants";

export type DolanResponse<T> =
  | { success: true; code: number; message: string; data: T; metas: Record<string, any> }
  | { success: false; code: number; message: string; error: string };
export type DolanResponseP<T> = Promise<DolanResponse<T>>;

const f = $fetch.create({
  baseURL: import.meta.env.VITE_DOLAN_API_URL,
  // TODO: Toast error here
  // onRequestError: async (_ctx) => {
  //   console.log("error1");
  // },
  // onResponseError: async (_ctx) => {
  //   console.log("error2");
  // },
});

type URLArg = Parameters<typeof f>[0];
type RestArgs = Parameters<typeof f>[1] & {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTION" | "HEAD"
};
export async function fetchApi<T = any>(url: URLArg, args?: RestArgs): DolanResponseP<T> {
  const res = await f(url, {
    ...args,
    headers: {
      Authorization: localStorage.getItem(DOLAN_TOKEN) ? `Bearer ${localStorage.getItem(DOLAN_TOKEN)}` : "",
      ...(args?.headers || {}),
    },
  });
  res.success = res.data !== undefined;
  return res;
}
