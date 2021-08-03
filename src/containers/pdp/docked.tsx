import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import Price from "components/Price";
import { Currency } from "typings/currency";
import { Product } from "typings/product";
import { currencyCodes } from "constants/currency";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

type Props = {
  data: Product;
  showAddToBagMobile?: boolean;
  buttoncall: any;
};

const DockedPanel: React.FC<Props> = ({ data, buttoncall }) => {
  const { showTimer } = useSelector((state: AppState) => state.info);
  const { currency } = useSelector((state: AppState) => state);
  return (
    <div
      className={cs(
        styles.secondaryHeaderContainer,
        { [styles.secondaryHeaderContainerTimer]: showTimer },
        bootstrap.row
      )}
    >
      <div className={bootstrap.col9}>
        <div className={styles.imgcontainer}>
          <img
            className={globalStyles.imgResponsive}
            src={
              "https://d3qn6cjsz7zlnp.cloudfront.net/media/images/product/Micro/I00201671-1571829149.jpg"
            }
          />
        </div>

        <span> </span>
      </div>
      <div className={cs(bootstrap.col1, styles.padding21)}>
        <Price
          product={data}
          code={currencyCodes[currency]}
          isSale={false}
          currency={"INR"}
        />
      </div>
      <div className={cs(bootstrap.col2, styles.padding14)}>{buttoncall}</div>
    </div>
  );
};

export default DockedPanel;
