import type { FC } from "react";
import type { EditorProps } from "@monaco-editor/react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Spin } from "@douyinfe/semi-ui";

interface Props {
  language?: string
  value?: string
  onChange?: (s: string) => void
}
type MonacoEditorProps = Props & Omit<
  EditorProps,
  keyof Props
>;

const MonacoEditor: FC<MonacoEditorProps> = ({ language, value, onChange, ...props }) => {
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
        {...props}
      />
    </div>
  );
};

export default MonacoEditor;
