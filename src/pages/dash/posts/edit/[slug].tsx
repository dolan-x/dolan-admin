import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Input, Modal, Row, Select, Space, Toast, Typography } from "@douyinfe/semi-ui";
import useAsyncEffect from "use-async-effect";
import type { Post } from "@dolan-x/shared";

import MilkdownEditor from "~/components/MilkdownEditor";
import MonacoEditor from "~/components/MonacoEditor";
import { Loading, SemiInput, SemiSelect, SemiSwitch, SemiTextArea } from "~/components/Dash/Common";
import { fetchApi, useMetas } from "~/lib";

const EditPost: FC = () => {
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
  const [defaultContent, setDefaultContent] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [sticky, setSticky] = useState(false);
  const [status, setStatus] = useState("");

  const {
    metas,
    setMetas,
    parsedMetas,
    metasBadJson,
    onMetasChange,
  } = useMetas();

  async function onFetch () {
    let resp;
    try {
      resp = await fetchApi<Post>(`posts/${routeSlug}`);
    } catch {
      Toast.error(t("pages.posts.not-exist"));
      navigate("../..");
      return;
    }
    if (resp.success) {
      const {
        title,
        content,
        slug,
        excerpt,
        sticky,
        status,
        metas,
      } = resp.data;
      setTitle(title);
      setContent(content);
      setDefaultContent(content);
      setSlug(slug);
      setExcerpt(excerpt);
      setSticky(sticky);
      setStatus(status);
      setMetas(JSON.stringify(metas, null, 2));
      setLoading(false);
    }
  }
  useAsyncEffect(onFetch, []);

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
      await fetchApi(`posts/${routeSlug}`, {
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

  const Milkdown = (
    <Loading loading={loading}>
      <MilkdownEditor defaultValue={defaultContent} value={content} onChange={setContent} />
    </Loading>
  );
  const ConfigEditor = (
    <Card
      header={(
        <div className="flex items-center justify-between">
          <Typography.Title heading={6}>
            {t("pages.posts.edit-post-config")}
          </Typography.Title>
          <Button type="tertiary" icon={<div className="i-ph:dots-three-vertical-bold" />} onClick={toggleShowMetaEditor} />
        </div>
      )}
    >
      <Loading loading={loading}>
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
      </Loading>
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
          {t("pages.posts.edit-post")}
        </Typography.Title>
      </div>
      <div className="flex gap-4">
        <Input
          size="large"
          placeholder={t("pages.posts.input-post-title")}
          disabled={loading}
          value={title}
          onChange={setTitle}
        />
        <Button
          size="large"
          theme="solid"
          disabled={loading}
          loading={saving}
          onClick={onSave}
        >
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

export default EditPost;
