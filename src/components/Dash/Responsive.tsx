import type { FC, ReactNode } from "react";
import { Col, Row, Space } from "@douyinfe/semi-ui";

interface ResponsiveViewProps {
  first: ReactNode
  second: ReactNode
}
const ResponsiveView: FC<ResponsiveViewProps> = ({
  first,
  second,
},
) => {
  return (
    <>
      <div className="hidden! md:display-block!">
        <Row>
          <Col span={16}>
            {first}
          </Col>
          <Col span={1} />
          <Col span={7}>
            {second}
          </Col>
        </Row>
      </div>
      <div className="display-block md:hidden">
        {first}
        <Space />
        {second}
      </div>
    </>
  );
};

export default ResponsiveView;
