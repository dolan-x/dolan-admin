import type { FC } from "react";
import { Button, Card, Col, Form, Modal, Popover, Row, Space, Spin, Toast } from "@douyinfe/semi-ui";
import useAsyncEffect from "use-async-effect";
import { HexColorPicker } from "react-colorful";
import type { Tag as DolanTag } from "@dolan-x/shared";

import { fetchApi } from "~/lib";
import TagCloud from "~/components/Tags/TagCloud";
import type { FormApi } from "~/types";

const Tags: FC = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<DolanTag[]>([]);
  const [color, setColor] = useState("");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const formApiRef = useRef<FormApi>();

  function toggleColorPickerVisible () {
    setColorPickerVisible(!colorPickerVisible);
  }

  async function onFetch () {
    const resp = await fetchApi("tags");
    if (resp.success)
      setTags(resp.data);
  }
  useAsyncEffect(onFetch, []);

  async function onSubmit (values: Partial<DolanTag>) {
    try {
      await fetchApi("tags", {
        method: "POST",
        body: values,
      });
      Toast.success(t("pages.tags.add-success"));
    } catch (e: any) {
      Toast.error(`${t("pages.tags.add-failed")} ${e.data.error}`);
      return;
    }
    onFetch();
  }

  useEffect(() => {
    formApiRef.current?.setValue("color", "1123");
  }, []);

  function onTagClick (tag: DolanTag) {
    console.log(tag);
    // TODO
  }

  const NewTag = (
    <Card title={t("pages.tags.new-tag")}>
      <Form onSubmit={onSubmit} getFormApi={formApi => formApiRef.current = formApi}>
        <Form.Input field="name" placeholder={t("pages.tags.name")} label={t("pages.tags.name")} />
        <Form.Input field="slug" placeholder={t("pages.tags.slug")} label={t("pages.tags.slug")} />
        <Form.TextArea field="description" placeholder={t("pages.tags.description")} label={t("pages.tags.description")} />
        {/* FIXME: https://github.com/DouyinFE/semi-design/issues/936/ */}
        <Form.Input
          field="color"
          placeholder={t("pages.tags.color")}
          label={t("pages.tags.color")}
          suffix={<div onClick={toggleColorPickerVisible} className="i-carbon-color-palette pr-2" />}
        />
        <Button type="primary" theme="solid" htmlType="submit">
          {t("pages.tags.add")}
        </Button>
      </Form>
    </Card>
  );
  const TagList = (
    <Card title={t("pages.tags.tag-list")}>
      {tags.length === 0
        ? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        )
        : <TagCloud tags={tags} onTagClick={onTagClick} />}
    </Card>
  );

  return (
    <div className="w-full">
      <div className="display-none md:display-block">
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
      <div className="display-block md:display-none">
        {NewTag}
        <Space />
        {TagList}
      </div>
      <Modal
        title={t("pages.tags.color")}
        visible={colorPickerVisible}
        onOk={toggleColorPickerVisible}
        closeOnEsc
        footer={(
          <Button type="primary" onClick={toggleColorPickerVisible}>
            OK
          </Button>
        )}
      >
        <div className="flex justify-center">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      </Modal>
    </div>
  );
};

export default Tags;
