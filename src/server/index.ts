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

const cwd = process.cwd();

const staticRoot = `${cwd}/dist`;

const app = new Koa();

app.use(serve(staticRoot));

const pug = new Pug({
  viewPath: path.resolve(__dirname, "templates"),
  debug: false,
  pretty: false,
  compileDebug: false,
  app: app // equals to pug.use(app) and app.use(pug.middleware)
});

pug.use(app);

app.use(history);
app.use(reduxStore);
app.use(cookies);
app.use(device);
app.use(initAction);
app.use(viewHandler);

app.listen(8000, () => {
  console.log(`App listening on port 8000`);
});
