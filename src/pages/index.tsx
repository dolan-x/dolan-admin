import type { FC } from "react";
import { Navigate } from "react-router-dom";

const Index: FC = () => {
  return <Navigate replace to="/dash" />;
};

export default Index;
