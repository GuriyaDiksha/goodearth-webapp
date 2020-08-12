import { InitAction } from "typings/actions";
import WishlistService from "services/wishlist";

const initActionWishlist: InitAction = async dispatch => {
  await WishlistService.updateWishlist(dispatch);
};

export default initActionWishlist;
