import type { FC } from "react";
import { Button, Card, Typography } from "@douyinfe/semi-ui";

import MilkdownEditor from "./MilkdownEditor";
import MonacoEditor from "./MonacoEditor";

import "material-icons/iconfont/outlined.css";
import "prism-themes/themes/prism-nord.css";
import "katex/dist/katex.min.css";

type EditorType = "milkdown" | "monaco";

interface MarkdownEditorProps {
  disabled?: boolean
  value?: string
  defaultValue?: string
  onChange?: (s: string) => void
}
const MarkdownEditor: FC<MarkdownEditorProps> = ({ ...props }) => {
  const { t } = useTranslation();
  const [currentEditor, setCurrentEditor] = useState<EditorType>("milkdown");

  const toggleEditor = () => { setCurrentEditor(currentEditor === "milkdown" ? "monaco" : "milkdown"); };

  return (
    <Card
      header={(
        <div className="flex items-center justify-between">
          <Typography.Title heading={6}>
            {t("components.markdown-editor.editor")}
          </Typography.Title>
          <Button title={t("components.markdown-editor.switch-editor")} type="tertiary" icon={<div className="i-ep:refresh" />} onClick={toggleEditor} />
        </div>
      )}
    >
      {currentEditor === "milkdown"
        ? <MilkdownEditor {...props} />
        : <MonacoEditor {...props} language="markdown" />}
    </Card>
  );
};

export default MarkdownEditor;
