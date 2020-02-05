import React, { memo } from "react";
import { Switch } from "react-router";
import routes from "routes/index";

const App: React.FC = () => {
  return <Switch>{routes}</Switch>;
};

export default memo(App);
