import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Select, Toast, Typography } from "@douyinfe/semi-ui";
import useAsyncEffect from "use-async-effect";
import type { ConfigPosts, Post } from "@dolan-x/shared";

import MilkdownEditor from "~/components/MilkdownEditor";
import MetaEditor from "~/components/Dash/MetaEditor";
import TagSelect from "~/components/Dash/Posts/TagSelect";
import ResponsiveView from "~/components/Dash/Responsive";
import { Loading, SemiDatepicker, SemiInput, SemiSelect, SemiSwitch, SemiTextArea } from "~/components/Dash/Common";
import { fetchApi, useMonacoJSON } from "~/lib";

const NewPost: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showMetaEditor, setShowMetaEditor] = useState(false);
  const toggleShowMetaEditor = () => { setShowMetaEditor(!showMetaEditor); };

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [defaultContent, setDefaultContent] = useState("");

  // Form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [created, setCreated] = useState(new Date());
  const [updated, setUpdated] = useState(new Date());
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([]);
  const [sticky, setSticky] = useState(false);
  const [status, setStatus] = useState("published");

  const {
    stringJSON,
    parsedJSON,
    badJSON,
    onJSONChange,
  } = useMonacoJSON();

  async function onFetch () {
    const resp = await fetchApi<ConfigPosts>("config/posts");
    if (resp.success) {
      setDefaultContent(resp.data.defaultContent);
    }
    setLoading(false);
  }
  useAsyncEffect(onFetch, []);

  async function onSave () {
    setSaving(true);
    if (badJSON) {
      Toast.error(t("pages.posts.metas-bad-json-format"));
      setSaving(false);
      return;
    }
    const body: Partial<Post> = {
      title,
      content,
      slug,
      excerpt,
      created: created.toISOString(),
      updated: updated.toISOString(),
      sticky,
      status,
      tags: selectedTagSlugs,
      categories: [],
      metas: parsedJSON,
    };
    try {
      await fetchApi("posts", {
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

  const Milkdown = (
    <Loading loading={loading}>
      <MilkdownEditor value={defaultContent} onChange={setContent} />
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
        <SemiDatepicker className="w-full" type="dateTime" value={created} onChange={setCreated as any} label={t("pages.posts.created")} />
        <SemiDatepicker className="w-full" type="dateTime" value={updated} onChange={setUpdated as any} label={t("pages.posts.updated")} />
        <TagSelect slugs={selectedTagSlugs} onChange={setSelectedTagSlugs} label={t("pages.posts.tags")} />
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
          disabled={loading}
          value={title}
          onChange={setTitle}
        />
        <Button size="large" theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </div>
      <ResponsiveView first={Milkdown} second={ConfigEditor} />
      <MetaEditor
        title={t("pages.posts.metas")}
        show={showMetaEditor}
        toggleShow={toggleShowMetaEditor}
        stringJSON={stringJSON}
        onJSONChange={onJSONChange}
      />
    </div>
  );
};

export default NewPost;
