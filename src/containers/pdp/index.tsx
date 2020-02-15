import React from "react";
import { connect } from "react-redux";
import cs from "classnames";
import { Props as PDPProps } from "./typings";
import initAction from "./initAction";

import { getProductIdFromSlug } from "utils/url";
import { AppState } from "store/typings";
import { Product } from "typings/product";
import SecondaryHeader from "components/SecondaryHeader";
import Breadcrumbs from "components/Breadcrumbs";
import VerticalImageSelector from "components/VerticalImageSelector";

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";

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

    const { breadcrumbs, sliderImages } = data;

    return (
      <div className={styles.pdpContainer}>
        <SecondaryHeader>
          <Breadcrumbs
            levels={breadcrumbs}
            className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}
          />
        </SecondaryHeader>
        <div className={cs(bootstrap.row)}>
          <div className={cs(bootstrap.colMd1, bootstrap.offsetMd1)}>
            <VerticalImageSelector images={sliderImages} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(PDPContainer);

export { initAction };
