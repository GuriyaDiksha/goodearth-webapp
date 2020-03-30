import React, { useEffect } from "react";
import { Props } from "./typings";
import { useStore } from "react-redux";
import { useLocation } from "react-router";

const RouteContainer: React.FC<Props> = ({ action, component, params }) => {
  const store = useStore();
  const Component = component;

  const location = useLocation();

  useEffect(() => {
    action(store.dispatch, params, location);
  }, [Object.values(params)]);

  return <Component {...params} />;
};

export default RouteContainer;
