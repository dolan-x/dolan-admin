import type { FC } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Spin } from "@douyinfe/semi-ui";

interface MonacoEditorProps {
  language?: string
  value?: string
  onChange?: (s: string) => void
}
const MonacoEditor: FC<MonacoEditorProps> = ({ language, value, onChange }) => {
  const monaco = useMonaco();

  const internalOnChange = (s?: string) => { onChange?.(s ?? ""); };

  language = language ?? "json";

  useEffect(() => {
    if (monaco) { monaco.languages.json.jsonDefaults.setDiagnosticsOptions({ enableSchemaRequest: true }); }
  }, [monaco]);

  const options = {
    tabSize: 2,
  };

  return (
    <div>
      <Editor
        height="60vh"
        language={language}
        options={options}
        loading={<Spin />}
        value={value}
        onChange={internalOnChange}
      />
    </div>
  );
};

export default MonacoEditor;
