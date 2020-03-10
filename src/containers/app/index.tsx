import React, { memo } from "react";
import { Switch } from "react-router";
import routes from "routes/index";
import BaseLayout from "containers/base";

const App: React.FC = () => {
  return (
    <BaseLayout>
      <Switch>{routes}</Switch>
    </BaseLayout>
  );
};

export default memo(App);
