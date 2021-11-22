import Koa from "koa";
import { getDevice } from "utils/device";
import { updateDeviceInfo } from "actions/device";

export default async function device(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const userAgent = ctx.headers["user-agent"];
  const {
    mobile,
    tablet,
    orientation
  }: {
    mobile: boolean;
    tablet: boolean;
    orientation: "portrait" | "landscape";
  } = userAgent
    ? getDevice(userAgent)
    : { mobile: false, tablet: false, orientation: "portrait" };
  const store = ctx.store;
  store.dispatch(updateDeviceInfo(mobile, tablet, orientation));

  await next();
}
