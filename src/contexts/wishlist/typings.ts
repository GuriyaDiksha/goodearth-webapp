import React from "react";
import { ProductID } from "typings/id";

export type WishlistContextType = React.Context<{
  wishlistItems: ProductID[];
  wishlistChildItems: ProductID[];
}>;
