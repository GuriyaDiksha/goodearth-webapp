import Koa from "koa";

export default async function device(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  try {
    await next();
  } catch (err) {
    console.log(err)
    if (err?.response?.status == 500) {
      ctx.redirect("/error-page");
      return;
    }

    ctx.status = err?.response?.status;
    ctx.body = "Please Wait !!!!!!  Currently build is in process..";
    ctx.app.emit("error", err, ctx);
  }
}
