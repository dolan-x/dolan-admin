import type { FC } from "react";
import { Layout } from "@douyinfe/semi-ui";

import Sidebar from "./Sidebar";
import Header from "./Header";

const DolanLayout: FC = ({ children }) => {
  return (
    <Layout className="min-h-100vh">
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
