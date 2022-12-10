// Wrap because of https://github.com/DouyinFE/semi-design/issues/936/

import type { ComponentType, FC, PropsWithChildren } from "react";
import { Card, DatePicker, Form, Input, InputNumber, Select, Switch, TagInput, TextArea } from "@douyinfe/semi-ui";

import MilkdownEditor from "~/components/MilkdownEditor";

type GetProps<T> = T extends ComponentType<infer P> ? P : never;

type PropsWithLabel<T extends Record<string, any>> = T & {
  label?: string
};
export function withLabel<P extends {}>(Comp: ComponentType<P>) {
  const Wrapped = (props: PropsWithLabel<P>) => (
    (
      <div className="py-3">
        <Form.Label className="block" text={props.label} />
        <div>
          <Comp {...props} />
        </div>
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

export const SemiDatepicker = withLabel(DatePicker);
export const SemiInput = withLabel(Input);
export const SemiInputNumber = withLabel(InputNumber);
export const SemiInputNumberOnly: FC<GetProps<typeof SemiInputNumber>> = (props) => {
  return (
    <SemiInputNumber
      min={0}
      max={Number.MAX_SAFE_INTEGER}
      formatter={value => `${value}`.replace(/\D/g, "")}
      {...props}
    />
  );
};
export const SemiTextArea = withLabel(TextArea);
// @ts-expect-error ...
export const SemiSelect = withLabel(Select);
// @ts-expect-error ...
export const SemiSwitch = withLabel(Switch);
// @ts-expect-error ...
export const SemiTagInput = withLabel(TagInput);

export const MilkdownEditorWithLabel = withLabel(MilkdownEditor);
