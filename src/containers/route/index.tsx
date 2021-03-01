import React, { useEffect } from "react";
import { Props } from "./typings";
import { useStore, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import MetaService from "services/meta";
import { PageMetaRequest } from "services/meta/typings";
import { AppState } from "reducers/typings";

const RouteContainer: React.FC<Props> = ({
  action,
  component,
  params,
  meta
}) => {
  const store = useStore();
  const Component = component;
  const location = useLocation();
  const { refresh } = useSelector((state: AppState) => state.user);
  const { currency } = useSelector((state: AppState) => state);
  const history = useHistory();
  params.refresh = "" + refresh;
  useEffect(() => {
    action(store, params, location, currency, history);
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
