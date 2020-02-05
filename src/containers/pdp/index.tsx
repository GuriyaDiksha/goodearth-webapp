import React from "react";
import { connect } from "react-redux";

import { Props as PDPProps } from "./typings";
import initAction from "./initAction";

import { getProductIdFromSlug } from "utils/url";
import { AppState } from "store/typings";
import { Product } from "typings/product";

const mapStateToProps = (state: AppState, props: PDPProps) => {
  const { slug } = props;
  const id = getProductIdFromSlug(slug);
  const data = (id && state.products[id]) as Product;
  return {
    id,
    data
  };
};

type Props = PDPProps & ReturnType<typeof mapStateToProps>;

class PDPContainer extends React.Component<Props> {
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    return <>{data.title}</>;
  }
}

export default connect(mapStateToProps)(PDPContainer);

export { initAction };
