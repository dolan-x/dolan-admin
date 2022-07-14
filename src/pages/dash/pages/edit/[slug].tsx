import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Input, Modal, Row, Space, Toast, Typography } from "@douyinfe/semi-ui";
import useAsyncEffect from "use-async-effect";
import type { Page } from "@dolan-x/shared";

import MilkdownEditor from "~/components/MilkdownEditor";
import MonacoEditor from "~/components/MonacoEditor";
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
  const [defaultContent, setDefaultContent] = useState("");
  const [slug, setSlug] = useState("");
  const [hidden, setHidden] = useState(false);

  const {
    stringJSON,
    setStringJSON,
    parsedJSON,
    badJSON,
    onJSONChange,
  } = useMonacoJSON();

  async function onFetch () {
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
        // FIXME: Hidden
        // @ts-expect-error Fix later
        hidden,
        metas,
      } = resp.data;
      setTitle(title);
      setContent(content);
      setDefaultContent(content);
      setSlug(slug);
      setHidden(hidden);
      setStringJSON(prettyJSON(metas));
      setLoading(false);
    }
  }
  useAsyncEffect(onFetch, []);

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
      <MonacoEditor value={stringJSON} onChange={onJSONChange} />
    </Modal>
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
      <div className="hidden! md:display-block!">
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

export default EditPage;
