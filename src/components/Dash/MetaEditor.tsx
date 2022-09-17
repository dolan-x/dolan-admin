import type { FC } from "react";
import { Button, Modal } from "@douyinfe/semi-ui";

import MonacoEditor from "../MonacoEditor";

interface MetaEditorProps {
  title: string
  show: boolean
  toggleShow: () => void
  stringJSON: string
  onJSONChange: (s: string | undefined) => void
}
const MetaEditor: FC<MetaEditorProps> = ({
  title,
  show,
  toggleShow,
  stringJSON,
  onJSONChange,
}) => {
  const { t } = useTranslation();
  // t("pages.posts.metas")
  return (
    <Modal
      title={title}
      visible={show}
      maskClosable={false}
      width={600}
      footer={(
        <Button type="primary" onClick={toggleShow}>
          {t("common.save")}
        </Button>
      )}
      onCancel={toggleShow}
    >
      <MonacoEditor value={stringJSON} onChange={onJSONChange} />
    </Modal>
  );
};

export default MetaEditor;
