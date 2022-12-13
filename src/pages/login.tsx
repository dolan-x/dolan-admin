import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Toast } from "@douyinfe/semi-ui";

import { useLoginStore } from "~/stores";
import { fetchApi } from "~/lib";

interface LoginData {
  username: string
  password: string
}

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginStore = useLoginStore();

  const [loading, setLoading] = useState(false);

  if (loginStore.token) { navigate("/dash"); }
  async function onLogin(data: LoginData) {
    setLoading(true);
    let resp;
    try {
      resp = await fetchApi("users/login", {
        method: "POST",
        body: data,
      });
    } catch (e: any) {
      Toast.error(`${t("login.login-failed")} ${e?.data?.error}`);
    }
    if (resp?.success) {
      loginStore.setToken(resp.data.token);
      Toast.success(t("login.login-success"));
    } else { Toast.error(t("login.login-failed")); }
    setLoading(false);
  }

  return (
    <div className="flex justify-center">
      <Form className="w-350px" disabled={loading} onSubmit={data => onLogin(data as LoginData)}>
        <Form.Input className="w-full" field="username" label={t("login.username")}rules={[
          { required: true, message: t("login.username-missing") },
        ]}
        />
        <Form.Input className="w-full" field="password" type="password" label={t("login.password")} rules={[
          { required: true, message: t("login.password-missing") },
        ]}
        />
        <div className="flex justify-between">
          <Link to="/signup">
            <Button>
              {t("login.signup")}
            </Button>
          </Link>
          <Button theme="solid" htmlType="submit" type="primary" loading={loading}>
            {t("login.login")}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
