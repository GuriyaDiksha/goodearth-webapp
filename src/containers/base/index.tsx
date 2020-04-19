import React from "react";
import Header from "components/header";
import Footer from "components/footer";
import Modal from "components/Modal";

export default class BaseLayout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
        <Modal />
      </div>
    );
  }
}
