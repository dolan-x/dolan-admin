import type { FC } from "react";
import { Button, Toast } from "@douyinfe/semi-ui";
import type { ConfigCategories } from "@dolan-x/shared";
import useAsyncEffect from "use-async-effect";

import { FormWrapper, Loading, SemiInputNumberOnly } from "~/components/Dash/Common";
import { fetchApi } from "~/lib";

const Categories: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maxPageSize, setMaxPageSize] = useState(10);

  async function onFetch () {
    let resp;
    try {
      resp = await fetchApi<ConfigCategories>("config/categories");
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
      await fetchApi("config/categories", {
        method: "PUT",
        body,
      });
      Toast.success(t("common.save-success"));
    } catch (e: any) {
      Toast.success(t("common.save-failed") + e?.data?.error);
    }
    setSaving(false);
  }

  return (
    <FormWrapper>
      <Loading loading={loading}>
        <SemiInputNumberOnly
          className="w-full"
          label={t("pages.config.categories.max-page-size")}
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

export default Categories;
