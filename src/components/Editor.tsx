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
];

interface MilkdownEditorProps {
  value?: string
  onChange?: (s: string) => void
}
export const MilkdownEditor: FC<MilkdownEditorProps> = ({ value }) => {
  const { editor } = useEditor(root =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        value && ctx.set(defaultValueCtx, value);
      })
      .use(plugins.flat()),
  );

  return <ReactEditor editor={editor} />;
};
