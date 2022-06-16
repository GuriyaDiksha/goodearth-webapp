import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import React from "react";
import SelectedPrice from "components/SelectedPrice";
import { Product } from "typings/product";
import { currencyCodes } from "constants/currency";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

type Props = {
  data: Product;
  showAddToBagMobile?: boolean;
  buttoncall: any;
  showPrice: boolean;
  price: string | number;
  discountPrice: string | number;
};

const DockedPanel: React.FC<Props> = ({
  data,
  buttoncall,
  showPrice,
  price,
  discountPrice
}) => {
  const { showTimer, isSale } = useSelector((state: AppState) => state.info);
  const { currency } = useSelector((state: AppState) => state);
  return (
    <div
      className={cs(
        { [styles.secondaryHeaderContainerTimer]: showTimer },
        bootstrap.row,
        styles.dockContainer
      )}
    >
      <div className={cs(bootstrap.col8, globalStyles.flex)}>
        <div className={styles.imgcontainer}>
          <img
            className={cs(globalStyles.imgResponsive)}
            src={data.images?.[0].productImage.replace("/Medium/", "/Micro/")}
          />
        </div>
        <span className={styles.dockText}>{data.altText}</span>
      </div>
      <div className={cs(bootstrap.col2)}>
        {!showPrice && (
          <SelectedPrice
            code={currencyCodes[currency]}
            isSale={isSale}
            currency={currency}
            price={price}
            discountPrice={discountPrice}
            discount={data.discount}
            badgeType={data.badgeType}
            className={styles.bottomDockPrice}
          />
        )}
      </div>
      <div className={cs(bootstrap.col2)}>{buttoncall}</div>
    </div>
  );
};

export default DockedPanel;
