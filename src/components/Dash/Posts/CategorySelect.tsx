import type { FC } from "react";
import { Select } from "@douyinfe/semi-ui";
import type { OptionProps } from "@douyinfe/semi-ui/lib/es/select";
import useAsyncEffect from "use-async-effect";
import type { Category } from "@dolan-x/shared";

import { Loading, withLabel } from "../Common";
import { fetchApi } from "~/lib";

interface CategorySelectProps {
  slug: string
  onChange: (slug: string) => void
}
const CategorySelect: FC<CategorySelectProps> = ({
  slug,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OptionProps[]>([]);

  async function onFetch() {
    setLoading(true);
    const resp = await fetchApi<Category[]>("categories");
    if (resp.success) {
      const categories = resp.data;
      setOptions(processOptions(categories));
    }
    setLoading(false);
  }
  useAsyncEffect(onFetch, []);

  function processOptions(categories: Category[]): OptionProps[] {
    return categories.map(({ slug, name }) => {
      return {
        value: slug,
        label: `${name} (${slug})`,
      };
    });
  }

  return (
    <Loading loading={loading}>
      <Select
        filter
        className="w-full"
        value={slug}
        optionList={options}
        onChange={onChange as any}
      />
    </Loading>
  );
};

export default withLabel(CategorySelect);
