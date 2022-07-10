import type { FC } from "react";
import { Button, Card, Toast } from "@douyinfe/semi-ui";
import type { ConfigSite } from "@dolan-x/shared";
import useAsyncEffect from "use-async-effect";

import { FormWrapper, Loading, SemiInput, SemiTagInput, SemiTextArea } from "~/components/Dash/Common";
import { fetchApi } from "~/lib";

const Site: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  async function onFetch () {
    let resp;
    try {
      resp = await fetchApi<ConfigSite>("config/site");
    } catch {
      // Toast.error(t("pages.config.site"));
      return;
    }
    if (resp.success) {
      const {
        name,
        description,
        keywords,
      } = resp.data;
      setName(name);
      setDescription(description);
      setKeywords(keywords);
      setLoading(false);
    } else {
      // Toast.error
    }
  }
  useAsyncEffect(onFetch, []);

  async function onSave () {
    setSaving(true);
    const body = {
      name,
      description,
      keywords,
    };
    await fetchApi("config/site", {
      method: "PUT",
      body,
    });
    Toast.success(t("common.save-success"));
    setSaving(false);
  }

  return (
    <FormWrapper>
      <Loading loading={loading}>
        <SemiInput label={t("pages.config.site.name")} value={name} onChange={setName} />
        <SemiTextArea label={t("pages.config.site.description")} value={description} onChange={setDescription} />
        <SemiTagInput label={t("pages.config.site.keywords")} value={keywords} onChange={setKeywords} />
        <Button theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </Loading>
    </FormWrapper>
  );
};

export default Site;
