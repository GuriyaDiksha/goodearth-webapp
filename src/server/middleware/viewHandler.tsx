import path from "path";
import Koa from "koa";
import React from "react";
import { Helmet } from "react-helmet";
import { matchPath } from "react-router";
import { ChunkExtractor } from "@loadable/server";
// import { h } from "preact"
import { ConnectedRouter } from "connected-react-router";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { paths, routeMap } from "routes/config";
import { ROUTES } from "routes/typings";
import { PageMetaRequest } from "services/meta/typings";
import MetaService from "services/meta";
import App from "containers/app";
import { cssChunks } from "../staticAssets/cssChunks";
import { LinkTag, Chunks } from "../typings";
import config from "../../config";
import { getPushHeader } from "../utils/response";

const statsFile = path.resolve("dist/static/loadable-stats.json");

const matchRoute = (url: string, routes: string[]) => {
  const match: any = matchPath(url, {
    path: paths,
    exact: false
  });
  if (!match || !routeMap[match.path as ROUTES]) {
    return null;
  }

  const result = {
    route: routeMap[match.path as ROUTES],
    params: match.params
  };
  return result;
};

const viewHandler: Koa.Middleware = async function(ctx, next) {
  const store = ctx.store;
  const history = ctx.history;
  const matchedRoute = matchRoute(ctx.URL.pathname, paths);
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ["client"] });

  if (matchedRoute && matchedRoute.route) {
    const { route, params } = matchedRoute;
    await route.action(store.dispatch, params, history.location);

    let request: PageMetaRequest | undefined;

    if (route.meta) {
      request = {
        page: "",
        pathName: history.location.pathname,
        ...route.meta(history.location)
      };

      await MetaService.updatePageMeta(store.dispatch, request);
    }

    const jsx = extractor.collectChunks(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );

    const html = renderToString(jsx);
    const meta = Helmet.renderStatic();
    const scriptTags = extractor.getScriptTags();
    const styleElements = extractor.getStyleElements();

    let styleSheets: string[] = [];
    const linkTags: LinkTag[] = [];

    styleElements.forEach((element: any) => {
      // const chunk = element.props["data-chunk"] as Chunks;
      const hrefArr = element.props.href.split("/");
      const cssName = hrefArr[hrefArr.length - 1];
      const [chunk] = cssName.split(".");
      styleSheets = styleSheets.concat(cssChunks[chunk as Chunks] as string[]);
      linkTags.push({
        chunk,
        type: "stylesheet",
        href: element.props.href
      });
    });

    const scriptElements = extractor.getScriptElements();

    const pushHeaders: string[] = [];
    scriptElements.forEach((element: any) => {
      if (element.props.src) {
        pushHeaders.push(getPushHeader(element.props.src, "script"));
      }
    });

    if (ctx.request.query.opt === "1") {
      ctx.set("Link", pushHeaders.join(", "));
    }

    await ctx.render("index", {
      state: JSON.stringify(store.getState()),
      content: html,
      scripts: scriptTags,
      styles: styleSheets,
      styleSheets: linkTags,
      head: meta,
      gtmdata: JSON.stringify(__GTM_ID__),
      manifest: `${config.publicPath}manifest.v${config.manifestVersion}.json`
    });
  }
};

export default viewHandler;
