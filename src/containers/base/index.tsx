import React from "react";
import { Switch } from "react-router";
import routes from "routes/index";
import Header from "components/header";
import Footer from "components/footer";
import Modal from "components/Modal";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";

const mapStateToProps = (state: AppState) => {
  return {
    refresh: state.user.refresh
  };
};
type props = ReturnType<typeof mapStateToProps>;

class BaseLayout extends React.Component<props, {}> {
  render() {
    return (
      <div>
        <Header />
        <Switch>{routes}</Switch>
        <Footer />
        <Modal />
      </div>
    );
  }
}

export default connect(mapStateToProps)(BaseLayout);
