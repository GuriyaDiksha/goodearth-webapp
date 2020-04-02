// services
import HeaderService from "services/headerFooter";
import MetaService from "services/meta";
import WishlistService from "services/wishlist";
import BasketService from "services/basket";
// actions
import { updatefooter } from "actions/footer";
import { updateheader } from "actions/header";
// typings
import { Store } from "redux";
import { AppState } from "reducers/typings";

const initAction: any = async (store: Store) => {
  const state: AppState = store.getState();

  return Promise.all([
    HeaderService.fetchHeaderDetails().then(header =>
      store.dispatch(updateheader(header))
    ),
    HeaderService.fetchFooterDetails().then(footer =>
      store.dispatch(updatefooter(footer))
    ),
    MetaService.updateMeta(store.dispatch, state.cookies),
    WishlistService.updateWishlist(store.dispatch),
    BasketService.fetchBasket(store.dispatch)
  ]);
};
export default initAction;
