import React, { memo } from "react";
import { connect } from "react-redux";
import { Switch } from "react-router";
import routes from "routes/index";
import BaseLayout from "containers/base";
import { AppState } from "reducers/typings";
// context
import WishlistContext from "contexts/wishlist";
import UserContext from "contexts/user";

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
        <BaseLayout>
          <Switch>{routes}</Switch>
        </BaseLayout>
      </WishlistContext.Provider>
    </UserContext.Provider>
  );
});

export default connect(mapStateToProps)(App);
