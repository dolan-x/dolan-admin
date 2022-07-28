import { $remark } from "@milkdown/utils";
import rehypeRaw from "rehype-raw";

// TODO
export const raw = $remark(() => rehypeRaw as any);
