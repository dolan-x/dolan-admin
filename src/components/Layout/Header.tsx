
import type { FC } from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Nav, Radio, RadioGroup, Toast } from "@douyinfe/semi-ui";

import { useAppStore, useLoginStore } from "~/stores";

const Sidebar: FC = () => {
  const { t, i18n } = useTranslation();
  const appStore = useAppStore();
  const loginStore = useLoginStore();

  const langs = {
    "en": "English",
    "zh-CN": "简体中文",
  };

  const onChangeI18n = (i18nName: string) => {
    appStore.setI18n(i18nName);
    i18n.changeLanguage(i18nName);
  };
  const onLogout = () => {
    loginStore.setToken("");
    Toast.success(t("login.logout-success"));
  };

  return (
    <Layout.Header>
      <Nav
        mode="horizontal"
        footer={(
          <div className="flex gap-3">
            <RadioGroup type="button" buttonSize="large" defaultValue={i18n.language} aria-label="I18n" onChange={(e) => { onChangeI18n(e.target.value); }}>
              {Object.entries(langs).map(([k, v]) => (
                <Radio key={k} value={k}>
                  {v}
                </Radio>
              ))}
            </RadioGroup>
            <Link to="/login">
              {loginStore.token
                ? (
                  <Button size="large" onClick={onLogout}>
                    {t("login.logout")}
                  </Button>
                )
                : (
                  <Button theme="solid" type="primary" size="large">
                    {t("login.login")}
                  </Button>
                )}
            </Link>
          </div>
        )}
      />
    </Layout.Header>
  );
};

export default Sidebar;
