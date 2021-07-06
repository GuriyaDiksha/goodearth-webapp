import { InitAction } from "typings/actions";
import WishlistService from "services/wishlist";

const initActionCart: InitAction = async (store, { slug }) => {
  try {
    await WishlistService.updateWishlist(store.dispatch);
  } catch (err) {
    // do nothing
  }
};

export default initActionCart;
