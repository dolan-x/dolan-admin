import type { FC } from "react";
import { Tag as SemiTag } from "@douyinfe/semi-ui";
import uniqolor from "uniqolor";
import type { Tag as DolanTag } from "@dolan-x/shared";

export interface TagProps {
  name: string
  slug: string
  color?: string
  onClick?: (tag: DolanTag) => void
}

const Tag: FC<TagProps> = ({ name, slug, color, onClick }) => {
  const { color: colorString } = useMemo(() => color ? ({ color }) : uniqolor(slug), []);

  function internalOnClick () {
    onClick?.({
      name,
      slug,
      description: "",
      color: color || "",
    });
  }

  return (
    <SemiTag className="cursor-pointer" color="white" style={{ backgroundColor: colorString }} onClick={internalOnClick}>
      {name}
    </SemiTag>
  );
};

export default Tag;
