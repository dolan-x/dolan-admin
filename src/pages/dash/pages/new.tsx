import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Modal, Row, Space, Toast, Typography } from "@douyinfe/semi-ui";

import MilkdownEditor from "~/components/MilkdownEditor";
import MonacoEditor from "~/components/MonacoEditor";
import { SemiInput, SemiSwitch } from "~/components/Dash/Common";
import { fetchApi, useMetas } from "~/lib";
import { NEW_POST_TEMPLATE } from "~/lib/templates";

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
    metas,
    parsedMetas,
    metasBadJson,
    onMetasChange,
  } = useMetas();

  async function onSave () {
    setSaving(true);
    if (metasBadJson) {
      Toast.error(t("pages.pages.metas-bad-json-format"));
      setSaving(false);
      return;
    }
    const body = {
      title,
      content,
      slug,
      hidden,
      metas: parsedMetas,
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

  const Milkdown = <MilkdownEditor value={NEW_POST_TEMPLATE} onChange={setContent} />;
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
  const MetaEditor = (
    <Modal
      title={t("pages.pages.metas")}
      visible={showMetaEditor}
      maskClosable={false}
      width={600}
      onCancel={toggleShowMetaEditor}
      footer={(
        <Button type="primary" onClick={toggleShowMetaEditor}>
          {t("common.save")}
        </Button>
      )}
    >
      <MonacoEditor value={metas} onChange={onMetasChange} />
    </Modal>
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
      <div className="hidden md:display-block">
        <Row>
          <Col span={16}>
            {Milkdown}
          </Col>
          <Col span={1} />
          <Col span={7}>
            {ConfigEditor}
          </Col>
        </Row>
      </div>
      <div className="display-block md:hidden">
        {Milkdown}
        <Space />
        {ConfigEditor}
      </div>
      {MetaEditor}
    </div>
  );
};

export default NewPage;
