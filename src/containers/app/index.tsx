import React, { memo } from "react";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
// context
import WishlistContext from "contexts/wishlist";
import UserContext from "contexts/user";
// components
import Base from "containers/base";

const mapStateToProps = (state: AppState) => {
  return {
    wishlist: state.wishlist.items,
    user: state.user
  };
};

type Props = ReturnType<typeof mapStateToProps>;

const App: React.FC<Props> = memo(({ wishlist, user }) => {
  const wishlistItems = wishlist.map(({ productId }) => productId);

  return (
    <UserContext.Provider value={user}>
      <WishlistContext.Provider value={wishlistItems}>
        <Base />
      </WishlistContext.Provider>
    </UserContext.Provider>
  );
});

export default connect(mapStateToProps)(App);
