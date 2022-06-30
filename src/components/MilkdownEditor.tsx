import type { FC } from "react";
import { Editor, defaultValueCtx, rootCtx } from "@milkdown/core";
import { ReactEditor, useEditor } from "@milkdown/react";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { milkdownPlugins } from "@dolan-x/milkdown-plugins";

import "prism-themes/themes/prism-nord.css";

interface MilkdownEditorProps {
  value?: string
  onChange?: (s: string) => void
}
const MilkdownEditor: FC<MilkdownEditorProps> = ({ value, onChange }) => {
  const { editor } = useEditor(root =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        value && ctx.set(defaultValueCtx, value);
        if (onChange) {
          ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
            onChange(markdown);
          });
        }
      })
      .use(listener)
      .use(milkdownPlugins),
  );

  return <ReactEditor editor={editor} />;
};

export default MilkdownEditor;
