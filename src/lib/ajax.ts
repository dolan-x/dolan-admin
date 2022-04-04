type FetchOptions = Exclude<Parameters<typeof fetch>[1], undefined>;

export async function ajax(url: string, opts?: FetchOptions) {
  return await (await fetch(`${import.meta.env.VITE_DOLAN_API_URL}/${url}`, {
    ...opts,
    headers: {
      ...opts?.headers,
      authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
    },
  }).then(r => r.json())).data;
}
