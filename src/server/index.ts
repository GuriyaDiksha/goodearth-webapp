import "newrelic";
import path from "path";
import Koa from "koa";
import Pug from "koa-pug";

import serve from "koa-static";

// middlewares
import history from "./middleware/history";
import reduxStore from "./middleware/reduxStore";
import cookies from "./middleware/cookies";
import device from "./middleware/device";
import initAction from "./middleware/initAction";
import viewHandler from "./middleware/viewHandler";
import errorHandler from "./middleware/errorHandler";

const cwd = process.cwd();

const staticRoot = `${cwd}/dist`;

const app = new Koa();
const PORT = process.env.NODE_PORT || 3000;

app.use(
  serve(staticRoot, {
    maxAge: 31536000000
  })
);

const pug = new Pug({
  viewPath: path.resolve(__dirname, "templates"),
  debug: false,
  pretty: false,
  compileDebug: false,
  app: app // equals to pug.use(app) and app.use(pug.middleware)
});

pug.use(app);
app.use(errorHandler);
app.use(history);
app.use(reduxStore);
app.use(cookies);
app.use(device);
app.use(initAction);
app.use(viewHandler);

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

server.timeout = 600000;
