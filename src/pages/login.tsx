import type { FC } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Form, Toast } from "@douyinfe/semi-ui";

import { useLoginStore } from "~/stores/login";
import { ajax } from "~/lib/ajax";

interface LoginData {
  username: string
  password: string
}

const Login: FC = () => {
  const { t } = useTranslation();
  const loginStore = useLoginStore();

  if (loginStore.token)
    return <Navigate to="/dash"></Navigate>;

  const onLogin = async(data: LoginData) => {
    const token = (await ajax("users/login", {
      method: "POST",
      body: JSON.stringify(data),
    }))?.token;
    if (token)
      loginStore.setToken(token);
    else
      Toast.error(t("login.login-failed"));
  };

  return (
    <div className="flex justify-center">
      <Form className="w-350px" onSubmit={data => onLogin(data as LoginData)}>
        <Form.Input field="username" label={t("login.username")} className="w-full" rules={[
          { required: true, message: t("login.username-missing") },
        ]} />
        <Form.Input field="password" type="password" label={t("login.password")} className="w-full" rules={[
          { required: true, message: t("login.password-missing") },
        ]} />
        <div className="flex justify-between">
          <Link to="/signup">
            <Button>{t("login.signup")}</Button>
          </Link>
          <Button theme="solid" htmlType="submit" type="primary">{t("login.login")}</Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
