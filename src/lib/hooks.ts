import useAsyncEffect from "use-async-effect";
import throttle from "lodash.throttle";

export function useThrottleAsyncEffect (
  effect: (isActive: () => boolean) => unknown | Promise<unknown>,
  inputs?: any[]
): void;
export function useThrottleAsyncEffect<V> (
  effect: (isActive: () => boolean) => V | Promise<V>,
  destroy?: (result?: V) => void,
  inputs?: any[]
): void;
export function useThrottleAsyncEffect (...args: any[]): any {
  const [effect, ...rest] = args;
  const throttledEffect = throttle(effect, 2000);
  return useAsyncEffect(throttledEffect, ...rest);
}

export function useMonacoJSON () {
  const [stringJSON, setStringJSON] = useState("{}");
  const [parsedJSON, setParsedJSON] = useState({});
  const [badJSON, setBadJSON] = useState(false);

  function onJSONChange (value: string | undefined) {
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
