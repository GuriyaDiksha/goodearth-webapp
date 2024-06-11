import Koa from "koa";
import initAction from "actions/initAction";
import { Store } from "redux";
import ApiService from "services/api";

export default async function fetchInitialData(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  // Get a reference to the Redux store from the Koa context
  const store: Store = ctx.store;

  // Determine if the current page is a public bridal page (not an account page)
  const isBridalPublicPage =
    ctx.request.path.includes("/registry/") &&
    !ctx.request.path.includes("/account/");

  // Initialize a variable to store the bridal key
  let bridalKey = "";

  // If it's a public bridal page, extract the bridal key from the URL path
  if (isBridalPublicPage) {
    const pathArray = ctx.request.path.split("/");
    bridalKey = pathArray[pathArray.length - 1];
  }

  // Fetch sales status data using the ApiService and update the Redux store
  await ApiService.getSalesStatus(store.dispatch, bridalKey).catch(err => {
    console.log("Sales Api Status ==== " + err);
  });

  // Execute the `initAction` function to further initialize actions
  await initAction(ctx, ctx.history);

  // Continue to the next middleware
  await next();
}
