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
  }
}
