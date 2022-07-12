// Wrap because of https://github.com/DouyinFE/semi-design/issues/936/

import type { ComponentType, FC, PropsWithChildren } from "react";
import { Card, Form, Input, InputNumber, Select, Switch, TagInput, TextArea } from "@douyinfe/semi-ui";

import MilkdownEditor from "~/components/MilkdownEditor";

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

export const FormWrapper: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Card>
      <div className="md:max-w-40%">
        {children}
      </div>
    </Card>
  );
};

export const SemiInput = withLabel(Input);
export const SemiInputNumber = withLabel(InputNumber);
export const SemiTextArea = withLabel(TextArea);
// @ts-expect-error ...
export const SemiSelect = withLabel(Select);
// @ts-expect-error ...
export const SemiSwitch = withLabel(Switch);
// @ts-expect-error ...
export const SemiTagInput = withLabel(TagInput);

export const MilkdownEditorWithLabel = withLabel(MilkdownEditor);
