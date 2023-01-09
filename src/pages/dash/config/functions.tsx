import type { FC } from "react";
// import { Button, Toast } from "@douyinfe/semi-ui";
import type { ConfigFunctions } from "@dolan-x/shared";
import useAsyncEffect from "use-async-effect";

// import { SemiInput } from "~/components/Dash/Common";
import { FormWrapper, Loading } from "~/components/Dash/Common";
import { fetchApi } from "~/lib";

const Functions: FC = () => {
  // const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  // const [saving, setSaving] = useState(false);
  // const [sitemapPostsBaseUrl, setSitemapPostsBaseUrl] = useState("");
  // const [sitemapCategoriesBaseUrl, setSitemapCategoriesBaseUrl] = useState("");
  // const [sitemapTagsBaseUrl, setSitemapTagsBaseUrl] = useState("");
  // const [sitemapPagesBaseUrl, setSitemapPagesBaseUrl] = useState("");

  async function onFetch() {
    let resp;
    try {
      resp = await fetchApi<ConfigFunctions>("config/functions");
    } catch {
      // Toast.error(t("pages.config.site"));
      return;
    }
    if (resp.success) {
      // const {
      //   sitemap: {
      //     postsBaseUrl,
      //     categoriesBaseUrl,
      //     tagsBaseUrl,
      //     pagesBaseUrl,
      //   },
      // } = resp.data;
      // setSitemapPostsBaseUrl(postsBaseUrl);
      // setSitemapCategoriesBaseUrl(categoriesBaseUrl);
      // setSitemapTagsBaseUrl(tagsBaseUrl);
      // setSitemapPagesBaseUrl(pagesBaseUrl);
      setLoading(false);
    } else {
      // Toast.error
    }
  }
  useAsyncEffect(onFetch, []);

  // async function onSave() {
  //   setSaving(true);
  //   const body: ConfigFunctions = {
  //     sitemap: {
  //       postsBaseUrl: sitemapPostsBaseUrl,
  //       categoriesBaseUrl: sitemapCategoriesBaseUrl,
  //       tagsBaseUrl: sitemapTagsBaseUrl,
  //       pagesBaseUrl: sitemapPagesBaseUrl,
  //     },
  //   };
  //   try {
  //     await fetchApi("config/functions", {
  //       method: "PUT",
  //       body,
  //     });
  //     Toast.success(t("common.save-success"));
  //   } catch (e: any) {
  //     Toast.error(t("common.save-failed") + e?.data?.error);
  //   }
  //   setSaving(false);
  // }

  return (
    <FormWrapper>
      <Loading loading={loading}>
        {/* <SemiInput label={t("pages.config.functions.sitemap.posts-baseurl")} value={sitemapPostsBaseUrl} onChange={setSitemapPostsBaseUrl} />
        <SemiInput label={t("pages.config.functions.sitemap.categories-baseurl")} value={sitemapCategoriesBaseUrl} onChange={setSitemapCategoriesBaseUrl} />
        <SemiInput label={t("pages.config.functions.sitemap.tags-baseurl")} value={sitemapTagsBaseUrl} onChange={setSitemapTagsBaseUrl} />
        <SemiInput label={t("pages.config.functions.sitemap.pages-baseurl")} value={sitemapPagesBaseUrl} onChange={setSitemapPagesBaseUrl} />
        <Button theme="solid" disabled={loading} loading={saving} onClick={onSave}>
          {t("common.save")}
        </Button> */}
      </Loading>
    </FormWrapper>
  );
};

export default Functions;
