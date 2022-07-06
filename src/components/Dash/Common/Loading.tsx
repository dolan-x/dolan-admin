import type { Component, FC } from "react";
import { Spin } from "@douyinfe/semi-ui";

type SpinProps = Spin extends Component<infer P> ? P : never;
type LoadingProps = SpinProps & {
  loading: boolean
};
export const Loading: FC<LoadingProps> = ({ loading, children, ...props }) => {
  if (loading) {
    return (
      <Spin {...props}>
        {children}
      </Spin>
    );
  }
  return (
    <>
      {children}
    </>
  );
};
