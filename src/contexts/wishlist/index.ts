import { createContext } from "react";
import { WishlistContextType } from "./typings";

const WishlistContext: WishlistContextType = createContext([0]);

export default WishlistContext;
