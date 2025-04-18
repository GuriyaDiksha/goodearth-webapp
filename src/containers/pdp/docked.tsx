import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import React, { useContext } from "react";
import SelectedPrice from "components/SelectedPrice";
import { Product } from "typings/product";
import { currencyCodes } from "constants/currency";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import CookieService from "services/cookie";
import { Context } from "components/Modal/context";

type Props = {
  data: Product;
  showAddToBagMobile?: boolean;
  buttoncall: any;
  showPrice: boolean;
  price: string | number;
  discountPrice: string | number;
  mobile: boolean;
};

const DockedPanel: React.FC<Props> = ({
  data,
  buttoncall,
  showPrice,
  price,
  discountPrice,
  mobile
}) => {
  const { showTimer, isSale } = useSelector((state: AppState) => state.info);
  const { closeModal } = useContext(Context);
  const {
    currency,
    filler: { button }
  } = useSelector((state: AppState) => state);
  if (
    typeof window !== "undefined" &&
    location.pathname === "/cart" &&
    location?.href !== CookieService.getCookie("prevUrl")
  ) {
    closeModal();
  }

  return (
    <div
      className={cs(
        { [styles.secondaryHeaderContainerTimer]: showTimer },
        bootstrap.row,
        styles.dockContainer
      )}
    >
      <div
        className={cs(bootstrap.col6, globalStyles.flex, {
          // [bootstrap.col8]: mobile
        })}
      >
        {!mobile && (
          <div className={styles.imgcontainer}>
            <img
              className={cs(globalStyles.imgResponsive)}
              src={
                data.images
                  ? data.images[0]?.productImage
                    ? data.images[0]?.productImage.replace(
                        "/Medium/",
                        "/Micro/"
                      )
                    : ""
                  : ""
              }
            />
          </div>
        )}
        <span className={cs(styles.dockText, { [styles.mobile]: mobile })}>
          {data.title}
        </span>
      </div>
      <div className={cs(bootstrap.col4, { [bootstrap.col6]: mobile })}>
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
        {currency === "INR" && (
          <p className={styles.incTax}>(Incl. of all taxes)</p>
        )}
      </div>
      {!mobile && (
        <div className={cs(bootstrap.col2)}>{button ? button : buttoncall}</div>
      )}
    </div>
  );
};

export default DockedPanel;
