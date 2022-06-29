import type { FC } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Spin } from "@douyinfe/semi-ui";

interface MonacoMetaEditorProps {
  value?: string
  onChange?: (s?: string) => void
}
const MonacoEditor: FC<MonacoMetaEditorProps> = ({ value, onChange }) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco)
      monaco.languages.json.jsonDefaults.diagnosticsOptions.enableSchemaRequest = true;
  }, [monaco]);

  return (
    <div>
      <Editor
        height="60vh"
        defaultLanguage="json"
        loading={<Spin />}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default MonacoEditor;
