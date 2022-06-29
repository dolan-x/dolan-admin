import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Toast, Typography } from "@douyinfe/semi-ui";
import type { Post } from "@dolan-x/shared";

import { MilkdownEditor } from "~/components/Editor";
// import { fetchApi } from "~/lib";
// import { usePostsStore } from "~/stores";
// import { toDisplayDate } from "~/utils";
import { NEW_POST_TEMPLATE } from "~/lib/templates";

const NewPost: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const postsStore = usePostsStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [autosavedAt, setAutosaveAt] = useState<Date | null>(null);
  // TODO
  // const postData: Partial<Post> = {
  //   title,
  // };

  async function onSave () {
    Toast.success(t("pages.posts.save-success"));
    navigate("../");
  }
  // TODO: Auto save
  // useEffect(() => {
  //   const autosave = setInterval(() => {
  //     console.log(postData);
  //     postsStore.setSavedPost(postData);
  //     setAutosaveAt(new Date());
  //   }, 3 * 1000); // Auto save each 3 sec
  //   return () => clearInterval(autosave);
  // }, []);

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-2 items-end">
        <Typography.Title heading={2}>
          {t("pages.posts.new-post")}
        </Typography.Title>
        {/* {autosavedAt !== null && (
          <Typography.Title heading={6}>
            {t("pages.posts.auto-saved")}
            {toDisplayDate(autosavedAt.toUTCString())}
          </Typography.Title>
        )} */}
      </div>
      <div className="flex gap-4">
        <Input
          size="large"
          placeholder={t("pages.posts.input-post-title")}
          value={title}
          onChange={setTitle}
        />
        <Button size="large" theme="solid" onClick={onSave}>
          {t("pages.posts.save")}
        </Button>
      </div>
      <MilkdownEditor value={NEW_POST_TEMPLATE} onChange={setContent} />
    </div>
  );
};

export default NewPost;
