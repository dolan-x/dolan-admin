import type { FC, PropsWithChildren } from "react";
import { Layout } from "@douyinfe/semi-ui";

import Sidebar from "./Sidebar";
import Header from "./Header";

const DolanLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Layout className="min-h-100vh bg-#f0f2f5">
      <Sidebar />
      <Layout>
        <Header />
        <Layout.Content className="p-6">
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DolanLayout;
