import React from "react";
import { Switch } from "react-router";
import routes from "routes/index";
import Header from "components/header";
import Footer from "components/footer";
import Modal from "components/Modal";

export default class BaseLayout extends React.Component {
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
