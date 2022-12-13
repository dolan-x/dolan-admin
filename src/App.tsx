import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { LocaleProvider, Spin } from "@douyinfe/semi-ui";
import { I18nextProvider } from "react-i18next";
import zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

import routes from "virtual:generated-pages-react";
import i18n from "./lib/i18n";
import { useAppStore } from "./stores";
import Layout from "~/components/Layout";

const langs = {
  "en": en_US,
  "zh-CN": zh_CN,
};

function App() {
  const appStore = useAppStore();

  const Loading = <Spin />;
  const currentLang = langs[appStore.i18n as keyof typeof langs];

  return (
    <I18nextProvider i18n={i18n}>
      <LocaleProvider locale={currentLang}>
        <Layout>
          <Suspense fallback={Loading}>
            {useRoutes(routes)}
          </Suspense>
        </Layout>
      </LocaleProvider>

    </I18nextProvider>
  );
}

export default App;
