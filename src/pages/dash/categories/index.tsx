import type { FC } from "react";
import { Button, Card, Col, Popconfirm, Row, Space, Spin, SplitButtonGroup, Toast } from "@douyinfe/semi-ui";
import useAsyncEffect from "use-async-effect";
import type { Category } from "@dolan-x/shared";

import { fetchApi } from "~/lib";
import { Loading, SemiInput, SemiTextArea } from "~/components/Dash/Common";
import CategoryList from "~/components/Categories/CategoryList";

const Categories: FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modified, setModified] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [origSlug, setOrigSlug] = useState("");
  const [description, setDescription] = useState("");
  const canAddOrUpdate = name !== "" && slug !== " ";

  async function onFetch() {
    const resp = await fetchApi("categories");
    if (resp.success) { setCategories(resp.data); }
  }
  useAsyncEffect(onFetch, []);

  async function onAdd() {
    if (!modified) { return; }
    if (!canAddOrUpdate) {
      // TODO: i18n
      Toast.error("required");
      return;
    }
    const body = {
      name,
      slug,
      description,
    };
    try {
      await fetchApi("categories", {
        method: "POST",
        body,
      });
      Toast.success(t("common.add-success"));
    } catch (e: any) {
      Toast.error(`${t("common.add-failed")} ${e?.data?.error}`);
      return;
    }
    onFetch();
  }

  async function onUpdate() {
    if (!modified) { return; }
    if (!canAddOrUpdate) {
      // TODO
      Toast.error("required");
      return;
    }
    const body = {
      name,
      slug,
      description,
    };
    try {
      await fetchApi(`categories/${origSlug}`, {
        method: "PUT",
        body,
      });
      Toast.success(t("common.update-success"));
    } catch (e: any) {
      Toast.error(`${t("common.update-failed")} ${e?.data?.error}`);
      return;
    }
    onFetch();
  }

  async function onCategoryDelete() {
    setLoading(true);
    await fetchApi<Category>(`categories/${origSlug}`, {
      method: "DELETE",
    });
    setLoading(false);
    onFetch();
  }

  async function onCategoryClick({ slug: requestSlug }: Category) {
    if (slug === requestSlug || loading) { return; }
    setIsEdit(true);
    setLoading(true);
    const resp = await fetchApi<Category>(`categories/${requestSlug}`);
    if (resp.success) {
      const { slug, name, description } = resp.data;
      setOrigSlug(slug);
      setSlug(slug);
      setName(name);
      setDescription(description);
    }
    setLoading(false);
  }

  function onClear() {
    setIsEdit(false);
    setModified(false);
    setName("");
    setSlug("");
    setDescription("");
  }

  function withSetModified<A, R>(fn: (_: A) => R) {
    return (_: A): R => {
      setModified(true);
      return fn(_);
    };
  }

  const NewCategory = (
    <Card title={t(isEdit ? "pages.categories.edit-category" : "pages.categories.new-category")}>
      <Loading loading={loading}>
        <SemiInput value={name} placeholder={t("pages.categories.name")} label={t("pages.categories.name")} onChange={withSetModified(setName)} />
        <SemiInput value={slug} placeholder={t("pages.categories.slug")} label={t("pages.categories.slug")} onChange={withSetModified(setSlug)} />
        <SemiTextArea value={description} placeholder={t("pages.categories.description")} label={t("pages.categories.description")} onChange={withSetModified(setDescription)} />
        <div className="flex gap-2 justify-between">
          <SplitButtonGroup>
            <Button theme="solid" disabled={!modified} onClick={isEdit ? onUpdate : onAdd}>
              { isEdit ? t("common.update") : t("common.add") }
            </Button>
            {isEdit && (
              <Button onClick={onClear}>
                {t("common.clear")}
              </Button>
            )}
          </SplitButtonGroup>
          {isEdit && (
            <Popconfirm title={t("common.confirm-delete")} onConfirm={onCategoryDelete}>
              <Button type="danger">
                {t("common.delete")}
              </Button>
            </Popconfirm>
          )}
        </div>
      </Loading>
    </Card>
  );
  const LazyCategoryList = (
    <Card title={t("pages.categories.category-list")}>
      {categories.length === 0
        ? (
          <div className="flex justify-center">
            <Spin />
          </div>
          )
        : <CategoryList categories={categories} onEdit={onCategoryClick} />}
    </Card>
  );

  return (
    <div className="w-full">
      <div className="hidden! md:display-block!">
        <Row>
          <Col span={13}>
            {NewCategory}
          </Col>
          <Col span={1} />
          <Col span={10}>
            {LazyCategoryList}
          </Col>
        </Row>
      </div>
      <div className="display-block md:hidden">
        {NewCategory}
        <Space />
        {LazyCategoryList}
      </div>
    </div>
  );
};

export default Categories;
