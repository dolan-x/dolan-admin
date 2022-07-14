import type { Metas } from "@dolan-x/shared";

export function useMetas () {
  const [metas, setMetas] = useState("{}");
  const [parsedMetas, setParsedMetas] = useState({} as Metas);
  const [metasBadJson, setMetasBadJson] = useState(false);

  function onMetasChange (value: string | undefined) {
    setMetas(value || "");
    if (value === "" || value === undefined) {
      setParsedMetas({});
      return;
    }
    try {
      const parsedMetas = JSON.parse(value.trim() || "");
      setParsedMetas(parsedMetas);
      setMetasBadJson(false);
    } catch {
      setMetasBadJson(true);
    }
  }

  return {
    metas,
    setMetas,
    parsedMetas,
    metasBadJson,
    onMetasChange,
  };
}
