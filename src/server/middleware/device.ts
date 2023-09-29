import Koa from "koa";
import { getDevice } from "utils/device";
import { updateDeviceInfo } from "actions/device";

export default async function device(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  // Retrieve user-agent and max-touch-points headers from the request
  const userAgent = ctx.headers["user-agent"];

  // Determine the device type and orientation using the user-agent and max-touch-points
  const {
    mobile, // Is it a mobile device?
    tablet, // Is it a tablet device?
    orientation // Device orientation (portrait or landscape)
  }: {
    mobile: boolean;
    tablet: boolean;
    orientation: "portrait" | "landscape";
  } = userAgent
    ? getDevice(userAgent)
    : { mobile: false, tablet: false, orientation: "portrait" };

  // Get a reference to the Redux store from the Koa context
  const store = ctx.store;

  // Dispatch an action to update device information in the Redux store
  store.dispatch(updateDeviceInfo(mobile, tablet, orientation));

  // Continue to the next middleware
  await next();
}
