
import type { FC } from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Nav, Radio, RadioGroup } from "@douyinfe/semi-ui";

import { useLoginStore } from "~/stores/login";

const Sidebar: FC = () => {
  const { t, i18n } = useTranslation();
  const loginStore = useLoginStore();

  const langs = {
    "en": "En",
    "zh-CN": "简体中文",
  };

  const onLogout = () => {
    loginStore.setToken("");
  };

  return (
    <Layout.Header>
      <Nav
        mode="horizontal"
        footer={
          <div className="flex gap-3">
            <RadioGroup type="button" buttonSize="large" defaultValue={i18n.language} aria-label="I18n" onChange={(e) => { i18n.changeLanguage(e.target.value); }}>
              {Object.entries(langs).map(([k, v]) => <Radio key={k} value={k}>{v}</Radio>)}
            </RadioGroup>
            <Link to="/login">
              {loginStore.token
                ? <Button size="large" onClick={onLogout}>
                  {t("login.logout")}
                </Button>
                : <Button theme="solid" type="primary" size="large">
                  {t("login.login")}
                </Button>}
            </Link>
          </div>
        }
      />
    </Layout.Header>
  );
};

export default Sidebar;
