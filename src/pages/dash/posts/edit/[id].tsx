import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Input, Modal, Row, Space, Toast, Typography } from "@douyinfe/semi-ui";
import useAsyncEffect from "use-async-effect";
import type { Metas, Post } from "@dolan-x/shared";

import MilkdownEditor from "~/components/MilkdownEditor";
import MonacoMetaEditor from "~/components/MonacoMetaEditor";
import { NEW_POST_TEMPLATE } from "~/lib/templates";
import { fetchApi } from "~/lib";
import type { FormApi, FormState } from "~/types";

type Config = Omit<Post, "title" | "content" | "metas">;

const EditPost: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

  const formRef = useRef<FormApi>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [config, setConfig] = useState<Config>({} as Config);
  const [metas, setMetas] = useState<Metas>({});
  const [metasString, setMetasString] = useState("{}");
  const [metasBadJSON, setMetasBadJSON] = useState(false);
  const [postData, setPostData] = useState<Partial<Post>>({});
  const [saving, setSaving] = useState(false);
  const [showMetaEditor, setShowMetaEditor] = useState(false);
  // const [autosavedAt, setAutosaveAt] = useState<Date | null>(null);
  // TODO

  async function onFetch () {
    let resp;
    try {
      resp = await fetchApi<Post>(`posts/${params.id}`);
      console.log(resp);
    } catch {
      Toast.error("文章不存在");
      navigate("../..", { replace: true });
    }
    if (resp?.success) {
      setPostData(resp);
      const {
        title,
        content,
        metas,
        ...config
      } = resp.data;
      setTitle(title);
      setContent(content);
      setMetas(metas);
      setConfig(config);

      // const formApi = formRef.current;
      // formApi?.setValue("slug", "fuck");
      // console.log(formRef.current?.getValue("slug"));
    }
  }

  useAsyncEffect(onFetch, []);

  function updatePostData () {
    setPostData({
      title,
      content,
      ...config,
      metas,
    });
  }
  useEffect(updatePostData, [title, content, config, metas]);

  function onConfigChange (values: FormState) {
    setConfig(values.values);
    updatePostData();
  }
  function toggleShowMetaEditor () {
    setShowMetaEditor(!showMetaEditor);
  }
  function onMetasChange (value: string | undefined) {
    setMetasString(value || "");
    if (value === "" || value === undefined) {
      setMetas({});
      return;
    }
    try {
      const parsedMetas = JSON.parse(value.trim() || "");
      setMetas(parsedMetas);
      setMetasBadJSON(false);
    } catch {
      setMetasBadJSON(true);
    }
  }
  async function onSave () {
    if (metasBadJSON) {
      Toast.error(t("pages.posts.metas-bad-json-format"));
      return;
    }
    setSaving(true);
    try {
      await fetchApi("posts", {
        method: "POST",
        body: postData,
      });
    } catch (e: any) {
      setSaving(false);
      Toast.error(`${t("pages.posts.save-failed")} ${e.data.error}`);
      return;
    }
    Toast.success(t("pages.posts.save-success"));
    setSaving(false);
    navigate("../");
  }
  // useEffect(() => {
  //   formRef.current?.setValue("slug", "d");
  //   console.log(formRef.current?.getValue("slug"));
  // }, []);
  // TODO: Auto save
  // useEffect(() => {
  //   const autosave = setInterval(() => {
  //     console.log(postData);
  //     postsStore.setSavedPost(postData);
  //     setAutosaveAt(new Date());
  //   }, 3 * 1000); // Auto save each 3 sec
  //   return () => clearInterval(autosave);
  // }, []);

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
      <Form getFormApi={formApi => formRef.current = formApi} onChange={onConfigChange}>
        <Form.Input field="slug" placeholder={t("pages.posts.slug")} label={t("pages.posts.slug")} />
        <Form.TextArea field="excerpt" placeholder={t("pages.posts.excerpt")} label={t("pages.posts.excerpt")} />
        <Form.Switch field="sticky" label={t("pages.posts.sticky")} />
        <Form.Select field="status" className="w-full" label={t("pages.posts.status.label")}>
          <Form.Select.Option value="published">
            {t("pages.posts.status.published")}
          </Form.Select.Option>
          <Form.Select.Option value="draft">
            {t("pages.posts.status.draft")}
          </Form.Select.Option>
        </Form.Select>
        {/* TODO */}
        {/* <Form.Select field="tags">
                  1
                </Form.Select> */}
      </Form>
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
      <MonacoMetaEditor value={metasString} onChange={onMetasChange} />
    </Modal>
  );

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-2 items-end">
        <Typography.Title heading={2}>
          {t("pages.posts.new-post")}
        </Typography.Title>
        {/* {autosavedAt !== null && (
          <Typography.Title heading={6}>
            {t("pages.posts.auto-saved")}
            {toDisplayDate(autosavedAt.toUTCString())}
          </Typography.Title>
        )} */}
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
