import type { FC } from "react";
import { Tag as SemiTag } from "@douyinfe/semi-ui";
import type { Tag as DolanTag } from "@dolan-x/shared";

export interface TagProps {
  name: string
  slug: string
  color: string
  onClick?: (tag: DolanTag) => void
}

const Tag: FC<TagProps> = ({ name, slug, color, onClick }) => {
  function internalOnClick() {
    onClick?.({
      name,
      slug,
      description: "",
      color,
    });
  }

  return (
    <SemiTag className="cursor-pointer" size="large" color="white" style={{ backgroundColor: color }} onClick={internalOnClick}>
      {name}
    </SemiTag>
  );
};

export default Tag;
