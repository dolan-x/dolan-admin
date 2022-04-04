import { defineStore, useAtom } from "sodayo";

export const useLoginStore = () => {
  const useDefine = () => {
    const token = useAtom(localStorage.getItem("token") ?? "");
    const setToken = (value: string) => {
      token.value = value;
      localStorage.setItem("token", value);
    };
    return {
      token,
      setToken,
    };
  };
  return defineStore(useDefine);
};
