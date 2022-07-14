import type { FC } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Spin } from "@douyinfe/semi-ui";

interface MonacoEditorProps {
  value?: string
  onChange?: (s?: string) => void
}
const MonacoEditor: FC<MonacoEditorProps> = ({ value, onChange }) => {
  const monaco = useMonaco();

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
        defaultLanguage="json"
        options={options}
        loading={<Spin />}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default MonacoEditor;
