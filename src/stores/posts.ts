import type { Post } from "@dolan-x/shared";
import { atom, defineStore } from "sodayo";

import { DOLAN_SAVED_POST } from "~/constants";
import { serializedLocalStorage } from "~/utils/storage";

export const usePostsStore = defineStore(() => {
  const savedPost = atom(serializedLocalStorage.getItem<Partial<Post>>(DOLAN_SAVED_POST) ?? {});
  function setSavedPost (value: Partial<Post>) {
    console.log(savedPost.value);
    savedPost.value = value;
    serializedLocalStorage.setItem(DOLAN_SAVED_POST, value);
  }
  return {
    savedPost,
    setSavedPost,
  };
});
