import { InitAction } from "typings/actions";
import WishlistService from "services/wishlist";

const initActionWishlist: InitAction = async store => {
  try {
    await WishlistService.updateWishlist(store.dispatch);
  } catch (err) {
    // do nothing
  }
};

export default initActionWishlist;
