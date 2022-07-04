import type { FC } from "react";
import type { Tag as DolanTag } from "@dolan-x/shared";

import Tag, { type TagProps } from "./Tag";

interface TagCloudProps {
  tags: DolanTag[]
  onTagClick?: TagProps["onClick"]
}

const TagCloud: FC<TagCloudProps> = ({ tags, onTagClick }) => {
  return (
    <div className="flex gap-2">
      {tags.map(({ name, slug, color }) => (
        <Tag
          key={slug}
          name={name}
          slug={slug}
          color={color}
          onClick={onTagClick}
        />
      ),
      )}
    </div>
  );
};

export default TagCloud;
