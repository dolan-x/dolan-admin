import type { FC } from "react";
import { Button, Toast } from "@douyinfe/semi-ui";
import type { ConfigPosts } from "@dolan-x/shared";
import useAsyncEffect from "use-async-effect";

import { FormWrapper, Loading, SemiInputNumber } from "~/components/Dash/Common";
import { fetchApi } from "~/lib";

const Posts: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maxPageSize, setMaxPageSize] = useState(10);
  const [defaultContent, setDdefaultContent] = useState("");

  async function onFetch () {
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
        // @ts-expect-error ...
        defaultContent,
      } = resp.data;
      setMaxPageSize(maxPageSize);
      setDdefaultContent(defaultContent);
      setLoading(false);
    } else {
      // Toast.error
    }
  }
  useAsyncEffect(onFetch, []);

  async function onSave () {
    setSaving(true);
    const body = {
      maxPageSize,
      defaultContent,
    };
    await fetchApi("config/posts", {
      method: "PUT",
      body,
    });
    Toast.success(t("common.save-success"));
    setSaving(false);
  }

  return (
    <FormWrapper>
      <Loading loading={loading}>
        <SemiInputNumber
          className="w-full"
          label={t("pages.config.site.name")}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          value={maxPageSize}
          formatter={value => `${value}`.replace(/\D/g, "")}
          onNumberChange={setMaxPageSize}
        />
        <Button theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </Loading>
    </FormWrapper>
  );
};

export default Posts;
