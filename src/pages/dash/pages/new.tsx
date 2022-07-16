import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Toast, Typography } from "@douyinfe/semi-ui";

import MilkdownEditor from "~/components/MilkdownEditor";
import MetaEditor from "~/components/Dash/MetaEditor";
import ResponsiveView from "~/components/Dash/Responsive";
import { SemiInput, SemiSwitch } from "~/components/Dash/Common";
import { fetchApi, useMonacoJSON } from "~/lib";
import { LOCAL_NEW_POST_TEMPLATE } from "~/lib/templates";

const NewPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showMetaEditor, setShowMetaEditor] = useState(false);
  const toggleShowMetaEditor = () => { setShowMetaEditor(!showMetaEditor); };

  const [saving, setSaving] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [hidden, setHidden] = useState(false);

  const {
    stringJSON,
    parsedJSON,
    badJSON,
    onJSONChange,
  } = useMonacoJSON();

  async function onSave () {
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
      await fetchApi("pages", {
        method: "POST",
        body,
      });
      Toast.success(t("common.save-success"));
      navigate("..");
    } catch (e: any) {
      Toast.error(`${t("common.save-failed")} ${e?.data?.error}`);
    }
    setSaving(false);
  }

  const Milkdown = <MilkdownEditor value={LOCAL_NEW_POST_TEMPLATE} onChange={setContent} />;
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
      <SemiInput value={slug} onChange={setSlug} placeholder={t("pages.pages.slug")} label={t("pages.pages.slug")} />
      <SemiSwitch checked={hidden} onChange={setHidden} label={t("pages.pages.hidden")} />
    </Card>
  );

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-2 items-end">
        <Typography.Title heading={2}>
          {t("pages.pages.new-page")}
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
      <ResponsiveView first={Milkdown} second={ConfigEditor} />
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

export default NewPage;
