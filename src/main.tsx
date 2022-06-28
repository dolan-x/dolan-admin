import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App";
import Layout from "~/components/Layout";

import "uno.css";
import "@unocss/reset/eric-meyer.css";
import "~/styles/main.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router>
        <Layout>
          <App />
        </Layout>
      </Router>
    </I18nextProvider>
  </StrictMode>,
);
