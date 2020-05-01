import Koa from "koa";
import { updateCookies } from "actions/cookies";
import API from "utils/api";

export default async function cookies(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const token = ctx.cookies.get("atkn");

  ctx.customCookies = {
    tkn: token
  };

  if (token) {
    const store = ctx.store;

    store.dispatch(
      updateCookies({
        tkn: token
      })
    );
  } else {
    const res: any = await API.post(
      ctx.store.dispatch,
      "http://api.goodearth.in/myapi/auth/login/",
      {
        email: "testuser1@mailinator.com",
        password: "password!@#"
      }
    );

    ctx.cookies.set("atkn", res.token, {
      path: "/",
      httpOnly: false
    });

    ctx.store.dispatch(
      updateCookies({
        tkn: res.token
      })
    );
  }
  await next();
}
