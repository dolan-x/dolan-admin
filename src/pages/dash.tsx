import type { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useLoginStore } from "../stores";

const Dash: FC = () => {
  const location = useLocation();
  const loginStore = useLoginStore();

  if (location.pathname.startsWith("/dash") && !loginStore.token)
    return <Navigate replace to="/login" />;

  return <Outlet />;
};

export default Dash;
