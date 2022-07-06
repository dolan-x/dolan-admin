// Wrap because of https://github.com/DouyinFE/semi-design/issues/936/

import { Form, Input, Select, Switch, TextArea } from "@douyinfe/semi-ui";
import type { ComponentType } from "react";

type PropsWithLabel<T extends Record<string, any>> = T & {
  label?: string
};
function withLabel<P extends {}> (Comp: ComponentType<P>) {
  const Wrapped = (props: PropsWithLabel<P>) => (
    (
      <div className="py-3">
        <Form.Label className="block" text={props.label} />
        <Comp {...props} />
      </div>
    )
  );
  return Wrapped;
}

export const SemiInput = withLabel(Input);
export const SemiTextArea = withLabel(TextArea);
// @ts-expect-error ...
export const SemiSelect = withLabel(Select);
// @ts-expect-error ...
export const SemiSwitch = withLabel(Switch);
