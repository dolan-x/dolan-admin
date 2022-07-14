import type { FC } from "react";
import { Button, Card, Toast } from "@douyinfe/semi-ui";
import type { ConfigPosts } from "@dolan-x/shared";
import useAsyncEffect from "use-async-effect";

import { FormWrapper, Loading } from "~/components/Dash/Common";
import { fetchApi, useMonacoJSON } from "~/lib";
import { prettyJSON } from "~/utils";
import MonacoEditor from "~/components/MonacoEditor";

const Custom: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    stringJSON,
    setStringJSON,
    badJSON,
    parsedJSON,
    onJSONChange,
  } = useMonacoJSON();

  async function onFetch () {
    let resp;
    try {
      resp = await fetchApi<ConfigPosts>("config/custom");
    } catch {
      // Toast.error(t("pages.config.site"));
      return;
    }
    if (resp.success) {
      setStringJSON(prettyJSON(resp.data));
      setLoading(false);
    } else {
      // Toast.error
    }
  }
  useAsyncEffect(onFetch, []);

  async function onSave () {
    setSaving(true);

    if (badJSON) {
      Toast.error(t("pages.config.custom.bad-json-format"));
      setSaving(false);
      return;
    }

    try {
      await fetchApi("config/custom", {
        method: "PUT",
        body: parsedJSON,
      });
      Toast.success(t("common.save-success"));
    } catch (e: any) {
      Toast.error(t("common.save-failed") + e?.data?.error);
    }
    setSaving(false);
  }

  return (
    <Loading loading={loading}>
      <Card>
        <MonacoEditor value={stringJSON} onChange={onJSONChange} />
        <Button className="mt-3" theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </Card>
    </Loading>
  );
};

export default Custom;
