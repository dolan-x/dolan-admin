import type { Metas } from "@dolan-x/shared";

export function useMonacoJSON() {
  const [stringJSON, setStringJSON] = useState("{}");
  const [parsedJSON, setParsedJSON] = useState({} as Metas);
  const [badJSON, setBadJSON] = useState(false);

  function onJSONChange(value: string | undefined) {
    setStringJSON(value || "");
    if (value === "" || value === undefined) {
      setParsedJSON({});
      return;
    }
    try {
      const parsedJSON = JSON.parse(value.trim() || "");
      setParsedJSON(parsedJSON);
      setBadJSON(false);
    } catch {
      setBadJSON(true);
    }
  }

  return {
    stringJSON,
    setStringJSON,
    parsedJSON,
    badJSON,
    onJSONChange,
  };
}
