import type { FC } from "react";
import { Button, Toast } from "@douyinfe/semi-ui";
import type { ConfigTags } from "@dolan-x/shared";
import useAsyncEffect from "use-async-effect";

import { FormWrapper, Loading, SemiInputNumberOnly } from "~/components/Dash/Common";
import { fetchApi } from "~/lib";

const Tags: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maxPageSize, setMaxPageSize] = useState(10);

  async function onFetch () {
    let resp;
    try {
      resp = await fetchApi<ConfigTags>("config/tags");
    } catch {
      // Toast.error(t("pages.config.site"));
      return;
    }
    if (resp.success) {
      const {
        maxPageSize,
      } = resp.data;
      setMaxPageSize(maxPageSize);
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
    };
    try {
      await fetchApi("config/tags", {
        method: "PUT",
        body,
      });
      Toast.success(t("common.save-success"));
    } catch (e: any) {
      Toast.success(t("common.save-failed") + e.data.error);
    }
    setSaving(false);
  }

  return (
    <FormWrapper>
      <Loading loading={loading}>
        <SemiInputNumberOnly
          className="w-full"
          label={t("pages.config.tags.max-page-size")}
          value={maxPageSize}
          onNumberChange={setMaxPageSize}
        />
        <Button theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </Loading>
    </FormWrapper>
  );
};

export default Tags;
