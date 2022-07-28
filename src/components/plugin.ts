import { $remark } from "@milkdown/utils";
import rehypeRaw from "rehype-raw";

export const raw = $remark(() => rehypeRaw);
