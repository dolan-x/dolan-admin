import type { FC } from "react";
import type { MilkdownPlugin } from "@milkdown/core";
import { Editor, defaultValueCtx, rootCtx } from "@milkdown/core";
import { ReactEditor, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { gfm } from "@milkdown/preset-gfm";
import { emoji } from "@milkdown/plugin-emoji";
import { indent } from "@milkdown/plugin-indent";
import { math } from "@milkdown/plugin-math";
import { slash } from "@milkdown/plugin-slash";
import { tooltip } from "@milkdown/plugin-tooltip";
import { upload } from "@milkdown/plugin-upload";
import { menu } from "@milkdown/plugin-menu";
import { history } from "@milkdown/plugin-history";
import { clipboard } from "@milkdown/plugin-clipboard";
import { prism } from "@milkdown/plugin-prism";
import { listener, listenerCtx } from "@milkdown/plugin-listener";

import "prism-themes/themes/prism-nord.css";

const plugins: (MilkdownPlugin | MilkdownPlugin[])[] = [
  nord,
  gfm,
  emoji,
  indent,
  math,
  slash,
  tooltip,
  upload,
  menu,
  history,
  clipboard,
  prism,
  listener,
];

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
      .use(plugins.flat()),
  );

  return <ReactEditor editor={editor} />;
};

export default MilkdownEditor;
