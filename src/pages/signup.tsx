import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Toast } from "@douyinfe/semi-ui";

import { fetchApi } from "~/lib";

interface SignupData {
  username: string
  password: string
}

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function onSignup (data: SignupData) {
    setLoading(true);
    let resp;
    try {
      resp = await fetchApi("users/signup", {
        method: "POST",
        body: data,
      });
    } catch (e: any) {
      Toast.error(`${t("login.signup-failed")} ${e?.data?.error}`);
    }
    if (resp?.success) {
      Toast.success(t("login.signup-success"));
      navigate("/login");
    } else { Toast.error(t("login.signup-failed")); }
    setLoading(false);
  }

  return (
    <div className="flex justify-center">
      <Form className="w-350px" disabled={loading} onSubmit={data => onSignup(data as SignupData)}>
        <Form.Input field="username" label={t("login.username")} className="w-full" rules={[
          { required: true, message: t("login.username-missing") },
        ]}
        />
        <Form.Input field="password" type="password" label={t("login.password")} className="w-full" rules={[
          { required: true, message: t("login.password-missing") },
        ]}
        />
        <div className="flex justify-between">
          <Link to="/login">
            <Button>
              {t("login.login")}
            </Button>
          </Link>
          <Button theme="solid" htmlType="submit" type="primary" loading={loading}>
            {t("login.signup")}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
