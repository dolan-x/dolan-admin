import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Spin } from "@douyinfe/semi-ui";

import routes from "virtual:generated-pages-react";

function App () {
  const Loading = <Spin size="large" />;

  return (
    <Suspense fallback={Loading}>
      {useRoutes(routes)}
    </Suspense>
  );
}

export default App;
