import type { FC } from "react";
import { Button, Toast } from "@douyinfe/semi-ui";
import type { ConfigPosts } from "@dolan-x/shared";
import useAsyncEffect from "use-async-effect";

import { FormWrapper, Loading, MilkdownEditorWithLabel, SemiInputNumberOnly } from "~/components/Dash/Common";
import { fetchApi } from "~/lib";

const Posts: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maxPageSize, setMaxPageSize] = useState(10);
  const [defaultContent, setDefaultContent] = useState("");

  async function onFetch() {
    let resp;
    try {
      resp = await fetchApi<ConfigPosts>("config/posts");
    } catch {
      // Toast.error(t("pages.config.site"));
      return;
    }
    if (resp.success) {
      const {
        maxPageSize,
        defaultContent,
      } = resp.data;
      setMaxPageSize(maxPageSize);
      setDefaultContent(defaultContent);
      setLoading(false);
    } else {
      // Toast.error
    }
  }
  useAsyncEffect(onFetch, []);

  async function onSave() {
    setSaving(true);
    const body = {
      maxPageSize,
      defaultContent,
    };
    try {
      await fetchApi("config/posts", {
        method: "PUT",
        body,
      });
      Toast.success(t("common.save-success"));
    } catch (e: any) {
      Toast.error(t("common.save-failed") + e?.data?.error);
    }
    setSaving(false);
  }

  return (
    <FormWrapper>
      <Loading loading={loading}>
        <SemiInputNumberOnly
          className="w-full"
          label={t("pages.config.posts.max-page-size")}
          value={maxPageSize}
          onNumberChange={setMaxPageSize}
        />
        <MilkdownEditorWithLabel label={t("pages.config.posts.default-content")} value={defaultContent} onChange={setDefaultContent} />
        <Button theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </Loading>
    </FormWrapper>
  );
};

export default Posts;
