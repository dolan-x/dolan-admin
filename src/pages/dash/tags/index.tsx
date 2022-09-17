import type { FC } from "react";
import { Button, Card, Col, Modal, Popconfirm, Row, Space, Spin, SplitButtonGroup, Toast } from "@douyinfe/semi-ui";
import { HexColorPicker } from "react-colorful";
import useAsyncEffect from "use-async-effect";
import { validateHTMLColorHex } from "validate-color";
import type { Tag as DolanTag } from "@dolan-x/shared";

import { fetchApi } from "~/lib";
import TagCloud from "~/components/Tags/TagCloud";
import { Loading, SemiInput, SemiTextArea } from "~/components/Dash/Common";

const Tags: FC = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<DolanTag[]>([]);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modified, setModified] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [origSlug, setOrigSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const isColorValid = color === "" ? true : validateHTMLColorHex(color);
  const canAddOrUpdate = name !== "" && slug !== " ";

  function toggleColorPickerVisible () {
    setColorPickerVisible(!colorPickerVisible);
  }

  async function onFetch () {
    const resp = await fetchApi("tags", { params: { all: "" } });
    if (resp.success) { setTags(resp.data); }
  }
  useAsyncEffect(onFetch, []);

  async function onAdd () {
    if (!modified) { return; }
    if (!isColorValid) {
      Toast.error(t("pages.tags.invalid-color-format"));
      return;
    }
    if (!canAddOrUpdate) {
      // TODO: i18n
      Toast.error("required");
      return;
    }
    const body = {
      name,
      slug,
      description,
      color,
    };
    try {
      await fetchApi("tags", {
        method: "POST",
        body,
      });
      Toast.success(t("pages.tags.add-success"));
    } catch (e: any) {
      Toast.error(`${t("pages.tags.add-failed")} ${e?.data?.error}`);
      return;
    }
    onFetch();
  }

  async function onUpdate () {
    if (!modified) { return; }
    if (!isColorValid) {
      Toast.error(t("pages.tags.invalid-color-format"));
      return;
    }
    if (!canAddOrUpdate) {
      // TODO
      Toast.error("required");
      return;
    }
    const body = {
      name,
      slug,
      description,
      color,
    };
    try {
      await fetchApi(`tags/${origSlug}`, {
        method: "PUT",
        body,
      });
      Toast.success(t("pages.tags.update-success"));
    } catch (e: any) {
      Toast.error(`${t("pages.tags.update-failed")} ${e?.data?.error}`);
      return;
    }
    onFetch();
  }

  async function onTagDelete () {
    setLoading(true);
    await fetchApi<DolanTag>(`tags/${origSlug}`, {
      method: "DELETE",
    });
    setLoading(false);
    onFetch();
  }

  async function onTagClick ({ slug: requestSlug }: Omit<DolanTag, "description">) {
    if (slug === requestSlug || loading) { return; }
    setIsEdit(true);
    setLoading(true);
    const resp = await fetchApi<DolanTag>(`tags/${requestSlug}`);
    if (resp.success) {
      const { slug, name, description, color } = resp.data;
      setOrigSlug(slug);
      setSlug(slug);
      setName(name);
      setColor(color);
      setDescription(description);
    }
    setLoading(false);
  }

  function onClear () {
    setIsEdit(false);
    setModified(false);
    setName("");
    setSlug("");
    setDescription("");
  }

  function withSetModified<A, R> (fn: (_: A) => R) {
    return (_: A): R => {
      setModified(true);
      return fn(_);
    };
  }

  const NewTag = (
    <Card title={t("pages.tags.new-tag")}>
      <Loading loading={loading}>
        <SemiInput value={name} placeholder={t("pages.tags.name")} label={t("pages.tags.name")} onChange={withSetModified(setName)} />
        <SemiInput value={slug} placeholder={t("pages.tags.slug")} label={t("pages.tags.slug")} onChange={withSetModified(setSlug)} />
        <SemiTextArea value={description} placeholder={t("pages.tags.description")} label={t("pages.tags.description")} onChange={withSetModified(setDescription)} />
        <SemiInput
          value={color}
          validateStatus={isColorValid ? "default" : "error"}
          placeholder={t("pages.tags.color")}
          label={t("pages.tags.color")}
          suffix={<div className="i-carbon:color-palette pr-2" style={{ color }} onClick={toggleColorPickerVisible} />}
          onChange={withSetModified(setColor)}
        />
        <div className="flex gap-2 justify-between">
          <SplitButtonGroup>
            <Button theme="solid" disabled={!modified} onClick={isEdit ? onUpdate : onAdd}>
              { isEdit ? t("pages.tags.update") : t("pages.tags.add") }
            </Button>
            {isEdit && (
              <Button onClick={onClear}>
                {t("pages.tags.clear")}
              </Button>
            )}
          </SplitButtonGroup>
          {isEdit && (
            <Popconfirm title={t("pages.tags.confirm-delete")} onConfirm={onTagDelete}>
              <Button type="danger">
                {t("pages.tags.delete")}
              </Button>
            </Popconfirm>
          )}
        </div>
      </Loading>
    </Card>
  );
  const TagList = (
    <Card title={t("pages.tags.tag-list")}>
      {tags.length === 0
        ? (
          <div className="flex justify-center">
            <Spin />
          </div>
        )
        : <TagCloud tags={tags} onTagClick={onTagClick} />}
    </Card>
  );

  return (
    <div className="w-full">
      <div className="hidden! md:display-block!">
        <Row>
          <Col span={13}>
            {NewTag}
          </Col>
          <Col span={1} />
          <Col span={10}>
            {TagList}
          </Col>
        </Row>
      </div>
      <div className="display-block md:hidden">
        {NewTag}
        <Space />
        {TagList}
      </div>
      <Modal
        closeOnEsc
        closable={false}
        title={t("pages.tags.color")}
        visible={colorPickerVisible}
        footer={(
          <Button type="primary" onClick={toggleColorPickerVisible}>
            OK
          </Button>
        )}
        onOk={toggleColorPickerVisible}
      >
        <div className="flex justify-center">
          <HexColorPicker color={color} onChange={withSetModified(setColor)} />
        </div>
      </Modal>
    </div>
  );
};

export default Tags;
