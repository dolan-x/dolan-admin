import type { FC } from "react";
import type { Ctx } from "@milkdown/core";
import { Editor, defaultValueCtx, editorViewCtx, parserCtx, rootCtx } from "@milkdown/core";
import { ReactEditor, useEditor } from "@milkdown/react";
import { Slice } from "@milkdown/prose/model";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { milkdownPlugins } from "@dolan-x/milkdown-plugins";

import { raw } from "./plugin";

import "material-icons/iconfont/outlined.css";
import "prism-themes/themes/prism-nord.css";
import "katex/dist/katex.min.css";

interface MilkdownEditorProps {
  disabled?: boolean
  value?: string
  defaultValue?: string
  onChange?: (s: string) => void
}
const MilkdownEditor: FC<MilkdownEditorProps> = ({ value, defaultValue, onChange, disabled }) => {
  const {
    editor,
    getInstance,
    loading,
  } = useEditor(root =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        value && ctx.set(defaultValueCtx, value);
        if (onChange && !disabled) {
          ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
            onChange(markdown);
          });
        }
      })
      .use(listener)
      // .use(raw)
      .use(milkdownPlugins),
  );

  useEffect(() => {
    if (loading) { return; }
    const editor = getInstance();
    if (editor) {
      editor.action((ctx: Ctx) => {
        const view = ctx.get(editorViewCtx);
        const parser = ctx.get(parserCtx);
        const doc = parser(defaultValue || "");
        if (!doc) { return; }
        const state = view.state;
        view.dispatch(
          state.tr.replace(
            0,
            state.doc.content.size,
            new Slice(doc.content, 0, 0),
          ),
        );
      });
    }
  }, [defaultValue]);

  return <ReactEditor editor={editor} />;
};

export default MilkdownEditor;
