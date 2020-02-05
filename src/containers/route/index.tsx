import React, { useEffect } from "react";
import { Props } from "./typings";
import { useStore } from "react-redux";

const RouteContainer: React.FC<Props> = ({ action, component, params }) => {
  const store = useStore();
  const Component = component;

  useEffect(() => {
    action(store.dispatch, params);
  }, [Object.values(params)]);

  return <Component {...params} />;
};

export default RouteContainer;
