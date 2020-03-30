import React, { memo } from "react";
import { connect } from "react-redux";
import { Switch } from "react-router";
import routes from "routes/index";
import BaseLayout from "containers/base";
import { AppState } from "reducers/typings";
// context
import WishlistContext from "contexts/wishlist";

const mapStateToProps = (state: AppState) => {
  return {
    wishlist: state.wishlist.items
  };
};

type Props = ReturnType<typeof mapStateToProps>;

const App: React.FC<Props> = memo(({ wishlist }) => {
  const wishlistItems = wishlist.map(({ productId }) => productId);

  return (
    <WishlistContext.Provider value={wishlistItems}>
      <BaseLayout>
        <Switch>{routes}</Switch>
      </BaseLayout>
    </WishlistContext.Provider>
  );
});

export default connect(mapStateToProps)(App);
