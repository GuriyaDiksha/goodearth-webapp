import { createContext } from "react";
import { WishlistContextType } from "./typings";

const WishlistContext: WishlistContextType = createContext({
  wishlistItems: [0],
  wishlistChildItems: [0]
});

export default WishlistContext;
