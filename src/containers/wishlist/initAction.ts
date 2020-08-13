import { InitAction } from "typings/actions";
import WishlistService from "services/wishlist";

const initActionWishlist: InitAction = async dispatch => {
  try {
    await WishlistService.updateWishlist(dispatch);
  } catch (err) {
    // do nothing
  }
};

export default initActionWishlist;
