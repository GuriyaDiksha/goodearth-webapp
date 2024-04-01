import Koa from "koa";
import { Store } from "redux";
import { getPushHeader } from "../utils/response";
import { AppState } from "reducers/typings";
import jsesc from "jsesc";
import path from "path";
import React from "react";
import { Helmet } from "react-helmet";
import { matchPath } from "react-router";
import { ChunkExtractor } from "@loadable/server";
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

// Define the path to the loadable-stats.json file
const statsFile = path.resolve("dist/static/loadable-stats.json");

// Function to match the current route with the defined paths
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

// Middleware for handling server-side rendering and view rendering
const viewHandler: Koa.Middleware = async function(ctx, next) {
  const store: Store = ctx.store;
  const history = ctx.history;

  // Match the current route based on the URL path
  const matchedRoute = matchRoute(ctx.URL.pathname, paths);

  // Get the current application state
  const state: AppState = ctx.store.getState();
  const domain = ctx.request.URL.origin;
  const dominList = ["dv", "stg", "pprod"];

  // Create a ChunkExtractor for extracting JavaScript chunks
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ["client"] });

  // Update the sessionid cookie if it has changed
  if (ctx.cookies.get("sessionid") != state.cookies.sessionid) {
    const expires = new Date(new Date().setMonth(new Date().getMonth() + 12));
    ctx.cookies.set("sessionid", state.cookies.sessionid, {
      httpOnly: false,
      expires: expires
    });
  }

  // Set Cache-Control header for account-related pages
  if (ctx.url.includes("/account")) {
    ctx.set("Cache-Control", "no-cache");
  }

  // Redirect to the /auth page if not authenticated and the domain is in dominList
  if (
    ctx.cookies.get("auth") != "true" &&
    !ctx.url.includes("/auth") &&
    dominList.some((v: any) => domain.includes(v))
  ) {
    ctx.redirect("/auth");
  }

  if (matchedRoute && matchedRoute.route) {
    const { route, params } = matchedRoute;
    await route.action(store, params, history.location);

    let request: PageMetaRequest | undefined;

    // Update page meta information if defined for the route
    if (route.meta) {
      request = {
        page: "",
        pathName: history.location.pathname,
        ...route.meta(history.location)
      };

      await MetaService.updatePageMeta(store.dispatch, request);
    }

    // Collect and render the React components
    let jsx;
    try {
      jsx = extractor.collectChunks(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      );
    } catch (err) {
      console.log("logError........." + err);
    }

    const html = renderToString(jsx);
    const meta = Helmet.renderStatic();
    const scriptTags = extractor.getScriptTags();
    const styleElements = extractor.getStyleElements();

    let styleSheets: string[] = [];
    const linkTags: LinkTag[] = [];

    styleElements.forEach((element: any) => {
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

    // Set Link headers for HTTP/2 server push if specified in the query
    if (ctx.request.query.opt === "1") {
      ctx.set("Link", pushHeaders.join(", "));
    }

    const id = __MOENG__.indexOf("_DEBUG") > -1 ? 1 : 0;

    // Render the HTML view with the collected data
    await ctx.render("index", {
      state: jsesc(JSON.stringify(store.getState()), {
        json: true,
        isScriptContext: true
      }),
      content: html,
      scripts: scriptTags,
      styles: styleSheets,
      styleSheets: linkTags,
      head: meta,
      gtmdata: JSON.stringify(__GTM_ID__),
      moengage: JSON.stringify(__MOENG__),
      moengageId: id,
      cdn: __CDN_HOST__,
      manifest: `${config.publicPath}manifest.v${config.manifestVersion}.json`
    });
  }
};

export default viewHandler;
