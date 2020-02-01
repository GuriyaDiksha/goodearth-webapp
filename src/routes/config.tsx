import routes from "./index";
import { RouteMap } from "./typings";

const paths: string[] = [];
const routeMap: RouteMap = {};

routes.forEach(route => {
  paths.push(route.path);
  routeMap[route.path] = route;
});

export { paths, routeMap };
