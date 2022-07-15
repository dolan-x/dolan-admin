import type { FC } from "react";
import type { OptionProps } from "@douyinfe/semi-ui/lib/es/select";
import useAsyncEffect from "use-async-effect";
import type { Tag } from "@dolan-x/shared";

import { Loading, SemiSelect, withLabel } from "../Common";
import { fetchApi } from "~/lib";

interface TagSelectProps {
  slugs: string[]
  onChange: (slugs: string[]) => void
}
const TagSelect: FC<TagSelectProps> = ({
  slugs,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OptionProps[]>([]);

  async function onFetch () {
    setLoading(true);
    const resp = await fetchApi<Tag[]>("tags", { params: { all: "" } });
    if (resp.success) {
      const tags = resp.data;
      setOptions(processOptions(tags));
    }
    setLoading(false);
  }
  useAsyncEffect(onFetch, []);

  function processOptions (tags: Tag[]): OptionProps[] {
    return tags.map((t) => {
      return {
        value: t.slug,
        label: t.name,
      };
    });
  }

  return (
    <Loading loading={loading}>
      <SemiSelect
        className="w-full"
        filter
        multiple
        value={slugs}
        optionList={options}
        onChange={onChange as any}
      />
    </Loading>
  );
};

export default withLabel(TagSelect);
