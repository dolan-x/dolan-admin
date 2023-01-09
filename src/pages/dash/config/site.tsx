import type { FC } from "react";
import { Button, Toast } from "@douyinfe/semi-ui";
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
  const [url, setUrl] = useState("");
  const [postsBaseUrl, setPostsBaseUrl] = useState("");
  const [pagesBaseUrl, setPagesBaseUrl] = useState("");
  const [tagsBaseUrl, setTagsBaseUrl] = useState("");
  const [categoriesBaseUrl, setCategoriesBaseUrl] = useState("");

  async function onFetch() {
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
        url,
        postsBaseUrl,
        pagesBaseUrl,
        tagsBaseUrl,
        categoriesBaseUrl,
      } = resp.data;
      setName(name);
      setDescription(description);
      setKeywords(keywords);
      setUrl(url);
      setPostsBaseUrl(postsBaseUrl);
      setPagesBaseUrl(pagesBaseUrl);
      setTagsBaseUrl(tagsBaseUrl);
      setCategoriesBaseUrl(categoriesBaseUrl);
      setLoading(false);
    } else {
      // Toast.error
    }
  }
  useAsyncEffect(onFetch, []);

  async function onSave() {
    setSaving(true);
    const body: ConfigSite = {
      name,
      description,
      keywords,
      url,
      postsBaseUrl,
      pagesBaseUrl,
      tagsBaseUrl,
      categoriesBaseUrl,
    };
    try {
      await fetchApi("config/site", {
        method: "PUT",
        body,
      });
      Toast.success(t("common.save-success"));
    } catch (e: any) {
      Toast.error(t("common.save-failed") + e?.data?.error);
    }
    setSaving(false);
  }

  return (
    <FormWrapper>
      <Loading loading={loading}>
        <SemiInput label={t("pages.config.site.name")} value={name} onChange={setName} />
        <SemiTextArea label={t("pages.config.site.description")} value={description} onChange={setDescription} />
        <SemiTagInput label={t("pages.config.site.keywords")} value={keywords} onChange={setKeywords} />
        <SemiInput label={t("pages.config.site.url")} value={url} onChange={setUrl} />
        <SemiInput label={t("pages.config.site.posts-baseurl")} value={postsBaseUrl} onChange={setPostsBaseUrl} />
        <SemiInput label={t("pages.config.site.pages-baseurl")} value={pagesBaseUrl} onChange={setPagesBaseUrl} />
        <SemiInput label={t("pages.config.site.tags-baseurl")} value={tagsBaseUrl} onChange={setTagsBaseUrl} />
        <SemiInput label={t("pages.config.site.categories-baseurl")} value={categoriesBaseUrl} onChange={setCategoriesBaseUrl} />
        <Button theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button>
      </Loading>
    </FormWrapper>
  );
};

export default Site;
