import type { FC } from "react";
import type { Category } from "@dolan-x/shared";
import { Button, ButtonGroup, List } from "@douyinfe/semi-ui";

interface CategoryListProps {
  categories: Category[]
  onEdit?: (category: Category) => void
}

const CategoryList: FC<CategoryListProps> = ({ categories, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div>
      <List
        dataSource={categories}
        renderItem={item => (
          <List.Item
            main={
              <div>
                <h1>{item.name}</h1>
                {item.description}
              </div>
            }
            extra={
              <ButtonGroup theme="borderless">
                <Button onClick={() => onEdit?.(item)}>{t("common.edit")}</Button>
              </ButtonGroup>
            }
          />
        )}
      />
    </div>
  );
};

export default CategoryList;
