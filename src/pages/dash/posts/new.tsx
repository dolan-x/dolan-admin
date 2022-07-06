import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Modal, Row, Select, Space, Toast, Typography } from "@douyinfe/semi-ui";
import type { Metas } from "@dolan-x/shared";

import MilkdownEditor from "~/components/MilkdownEditor";
import MonacoMetaEditor from "~/components/MonacoMetaEditor";
import { SemiInput, SemiSelect, SemiSwitch, SemiTextArea } from "~/components/Dash/Common";
import { fetchApi } from "~/lib";
import { NEW_POST_TEMPLATE } from "~/lib/templates";

const EditPost: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showMetaEditor, setShowMetaEditor] = useState(false);
  const toggleShowMetaEditor = () => { setShowMetaEditor(!showMetaEditor); };

  const [saving, setSaving] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [sticky, setSticky] = useState(false);
  const [status, setStatus] = useState("published");

  const [metas, setMetas] = useState("{}");
  const [parsedMetas, setParsedMetas] = useState({} as Metas);
  const [metasBadJson, setMetasBadJson] = useState(false);

  async function onSave () {
    setSaving(true);
    if (metasBadJson) {
      Toast.error(t("pages.posts.metas-bad-json-format"));
      setSaving(false);
      return;
    }
    const body = {
      title,
      content,
      slug,
      excerpt,
      sticky,
      status,
      tags: [],
      categories: [],
      metas: parsedMetas,
    };
    try {
      await fetchApi("posts", {
        method: "POST",
        body,
      });
      Toast.success(t("pages.posts.save-success"));
      navigate("..");
    } catch (e: any) {
      Toast.error(`${t("pages.posts.save-failed")} ${e.data.error}`);
    }
    setSaving(false);
  }

  function onMetasChange (value: string | undefined) {
    setMetas(value || "");
    if (value === "" || value === undefined) {
      setParsedMetas({});
      return;
    }
    try {
      const parsedMetas = JSON.parse(value.trim() || "");
      setParsedMetas(parsedMetas);
      setMetasBadJson(false);
    } catch {
      setMetasBadJson(true);
    }
  }

  const Milkdown = <MilkdownEditor value={NEW_POST_TEMPLATE} onChange={setContent} />;
  const ConfigEditor = (
    <Card
      header={(
        <div className="flex items-center justify-between">
          <Typography.Title heading={6}>
            {t("pages.posts.edit-post-config")}
          </Typography.Title>
          <Button type="tertiary" icon={<div className="i-ph-dots-three-vertical-bold" />} onClick={toggleShowMetaEditor} />
        </div>
      )}
    >
      <SemiInput value={slug} onChange={setSlug} placeholder={t("pages.posts.slug")} label={t("pages.posts.slug")} />
      <SemiTextArea autosize value={excerpt} onChange={setExcerpt} placeholder={t("pages.posts.excerpt")} label={t("pages.posts.excerpt")} />
      <SemiSwitch checked={sticky} onChange={setSticky} label={t("pages.posts.sticky")} />
      <SemiSelect value={status} onChange={setStatus as any} className="w-full" label={t("pages.posts.status.label")}>
        <Select.Option value="published">
          {t("pages.posts.status.published")}
        </Select.Option>
        <Select.Option value="draft">
          {t("pages.posts.status.draft")}
        </Select.Option>
      </SemiSelect>
    </Card>
  );
  const MetaEditor = (
    <Modal
      title={t("pages.posts.metas")}
      visible={showMetaEditor}
      maskClosable={false}
      width={600}
      onCancel={toggleShowMetaEditor}
      footer={(
        <Button type="primary" onClick={toggleShowMetaEditor}>
          {t("pages.posts.save")}
        </Button>
      )}
    >
      <MonacoMetaEditor value={metas} onChange={onMetasChange} />
    </Modal>
  );

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-2 items-end">
        <Typography.Title heading={2}>
          {t("pages.posts.new-post")}
        </Typography.Title>
      </div>
      <div className="flex gap-4">
        <Input
          size="large"
          placeholder={t("pages.posts.input-post-title")}
          value={title}
          onChange={setTitle}
        />
        <Button size="large" theme="solid" loading={saving} onClick={onSave}>
          {t("pages.posts.save")}
        </Button>
      </div>
      <div className="display-none md:display-block">
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
      <div className="display-block md:display-none">
        {Milkdown}
        <Space />
        {ConfigEditor}
      </div>
      {MetaEditor}
    </div>
  );
};

export default EditPost;
