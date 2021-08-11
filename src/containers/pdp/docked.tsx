import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import React from "react";
import Price from "components/Price";
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
      <div className={cs(bootstrap.col9, globalStyles.flex)}>
        <div className={styles.imgcontainer}>
          <img
            className={globalStyles.imgResponsive}
            src={data.images?.[0].productImage.replace("/Medium/", "/Micro/")}
          />
        </div>
        <span className={styles.dockText}> {data.altText}</span>
      </div>
      <div className={cs(bootstrap.col1, styles.padding21)}>
        <Price
          product={data}
          code={currencyCodes[currency]}
          isSale={false}
          currency={currency}
        />
      </div>
      <div className={cs(bootstrap.col2, styles.padding14)}>{buttoncall}</div>
    </div>
  );
};

export default DockedPanel;
