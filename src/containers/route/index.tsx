import React, { useEffect } from "react";
import { Props } from "./typings";
import { useStore } from "react-redux";

const RouteContainer: React.FC<Props> = ({ action, component, params }) => {
  const store = useStore();
  useEffect(() => {
    // const state = store.getState();
    action(store.dispatch, params);
  }, [Object.values(params)]);
  const Component = component;

  return <Component />;
};

export default RouteContainer;
