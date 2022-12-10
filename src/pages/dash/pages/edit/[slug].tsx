import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input, Toast, Typography } from "@douyinfe/semi-ui";
import useAsyncEffect from "use-async-effect";
import type { Page } from "@dolan-x/shared";

import MarkdownEditor from "~/components/MarkdownEditor";
import MetaEditor from "~/components/Dash/MetaEditor";
import ResponsiveView from "~/components/Dash/Responsive";
import { Loading, SemiInput, SemiSwitch } from "~/components/Dash/Common";
import { fetchApi, useMonacoJSON } from "~/lib";
import { prettyJSON } from "~/utils";

const EditPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const routeSlug = params.slug;

  const [showMetaEditor, setShowMetaEditor] = useState(false);
  const toggleShowMetaEditor = () => { setShowMetaEditor(!showMetaEditor); };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [hidden, setHidden] = useState(false);

  const {
    stringJSON,
    setStringJSON,
    parsedJSON,
    badJSON,
    onJSONChange,
  } = useMonacoJSON();

  async function onFetch() {
    let resp;
    try {
      resp = await fetchApi<Page>(`pages/${routeSlug}`);
    } catch {
      Toast.error(t("pages.pages.not-exist"));
      navigate("../..");
      return;
    }
    if (resp.success) {
      const {
        title,
        content,
        slug,
        hidden,
        metas,
      } = resp.data;
      setTitle(title);
      setContent(content);
      setSlug(slug);
      setHidden(hidden);
      setStringJSON(prettyJSON(metas));
      setLoading(false);
    }
  }
  useAsyncEffect(onFetch, []);

  async function onSave() {
    setSaving(true);
    if (badJSON) {
      Toast.error(t("pages.pages.metas-bad-json-format"));
      setSaving(false);
      return;
    }
    const body = {
      title,
      content,
      slug,
      hidden,
      metas: parsedJSON,
    };
    try {
      await fetchApi(`pages/${routeSlug}`, {
        method: "PUT",
        body,
      });
      Toast.success(t("common.save-success"));
      navigate("../..");
    } catch (e: any) {
      Toast.error(`${t("common.save-failed")} ${e?.data?.error}`);
    }
    setSaving(false);
  }

  const Markdown = (
    <Loading loading={loading}>
      <MarkdownEditor value={content} onChange={setContent} />
    </Loading>
  );
  const ConfigEditor = (
    <Card
      header={(
        <div className="flex items-center justify-between">
          <Typography.Title heading={6}>
            {t("pages.pages.edit-page-config")}
          </Typography.Title>
          <Button type="tertiary" icon={<div className="i-ph:dots-three-vertical-bold" />} onClick={toggleShowMetaEditor} />
        </div>
      )}
    >
      <SemiInput value={slug} placeholder={t("pages.pages.slug")} label={t("pages.pages.slug")} onChange={setSlug} />
      <SemiSwitch checked={hidden} label={t("pages.pages.hidden")} onChange={setHidden} />
    </Card>
  );

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-2 items-end">
        <Typography.Title heading={2}>
          {t("pages.pages.edit-page")}
        </Typography.Title>
      </div>
      <div className="flex gap-4">
        <Input
          size="large"
          placeholder={t("pages.pages.input-page-title")}
          value={title}
          onChange={setTitle}
        />
        <Button size="large" theme="solid" loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </div>
      <ResponsiveView first={Markdown} second={ConfigEditor} />
      <MetaEditor
        title={t("pages.pages.metas")}
        show={showMetaEditor}
        toggleShow={toggleShowMetaEditor}
        stringJSON={stringJSON}
        onJSONChange={onJSONChange}
      />
    </div>
  );
};

export default EditPage;
