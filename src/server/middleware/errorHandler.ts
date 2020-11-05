import Koa from "koa";

export default async function device(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  try {
    await next();
  } catch (err) {
    if (err?.response?.status == 500) {
      ctx.redirect("/error-page");
    }
    ctx.status = 1001;
    ctx.body = "Please Wait !!!!!!  Currently build is in process..";
    ctx.app.emit("error", err, ctx);
  }
}
