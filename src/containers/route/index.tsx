import React, { useEffect } from "react";
import { Props } from "./typings";
import { useStore } from "react-redux";
import { useLocation } from "react-router";
import MetaService from "services/meta";
import { PageMetaRequest } from "services/meta/typings";

const RouteContainer: React.FC<Props> = ({
  action,
  component,
  params,
  meta
}) => {
  const store = useStore();
  const Component = component;
  const location = useLocation();

  useEffect(() => {
    action(store.dispatch, params, location);
    let request: PageMetaRequest | undefined;

    if (meta) {
      request = {
        page: "",
        pathName: location.pathname,
        ...meta(location)
      };
    }

    MetaService.updatePageMeta(store.dispatch, request);
  }, [...Object.values(params)]);

  return <Component {...params} />;
};

export default RouteContainer;
