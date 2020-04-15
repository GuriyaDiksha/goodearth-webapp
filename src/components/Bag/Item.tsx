import React, { memo, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { BasketItem } from "typings/basket";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import Quantity from "components/quantity";
import "../../styles/override.css";
import { currencyCodes } from "constants/currency";
import WishlistButton from "components/WishlistButton";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import BasketService from "services/basket";
import { useStore } from "react-redux";

const LineItems: React.FC<BasketItem> = memo(
  ({
    id,
    bridalProfile,
    giftCardImage,
    quantity,
    product,
    currency,
    saleStatus
  }) => {
    const [value, setValue] = useState(quantity | 0);
    const { dispatch } = useStore();

    const handleChange = (value: number) => {
      BasketService.updateToBasket(dispatch, id, value).then(res => {
        setValue(value);
      });
    };

    const deleteItem = () => {
      BasketService.deleteBasket(dispatch, id);
    };

    const getSize = (data: any) => {
      const size = data.find(function(attribute: any) {
        if (attribute.name == "Size") {
          return attribute;
        }
      });
      return size ? <div className={styles.size}>Size: {size.value}</div> : "";
    };

    const {
      plpImages,
      collections,
      title,
      url,
      priceRecords,
      discount,
      discountedPriceRecords
    } = product;

    const price = priceRecords[currency];

    return (
      <div className={cs(styles.cartItem, styles.gutter15, "cart-item")}>
        <div className={bootstrap.row}>
          <div className={cs(bootstrap.col4, styles.cartPadding)}>
            <div className={styles.cartRing}></div>
            <a href={url}>
              <img
                className={styles.productImage}
                src={plpImages ? plpImages[0] : ""}
              />
            </a>
          </div>
          <div className={cs(bootstrap.col8, styles.cartPadding)}>
            <div className={styles.collectionName}>{collections[0]}</div>
            <div className={bootstrap.row}>
              <div className={cs(bootstrap.col10, styles.name)}>
                <div>
                  <a href={url}>{title}</a>
                </div>
                <div className={styles.productPrice}>
                  {saleStatus && discount && discountedPriceRecords ? (
                    <span className={styles.discountedPrice}>
                      {String.fromCharCode(currencyCodes[currency])}
                      &nbsp;
                      {discountedPriceRecords[currency]}
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                  {saleStatus && discount ? (
                    <span className={styles.oldPrice}>
                      {String.fromCharCode(currencyCodes[currency])}
                      &nbsp;
                      {price}
                    </span>
                  ) : (
                    <span>
                      {" "}
                      {String.fromCharCode(currencyCodes[currency])}
                      &nbsp;
                      {price}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={cs(
                  bootstrap.col2,
                  styles.pointer,
                  styles.textCenter,
                  styles.remove
                )}
              >
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.crossiconItem
                  )}
                  onClick={deleteItem}
                ></i>
              </div>
            </div>
            <div className={cs(bootstrap.row, styles.section)}>
              <div className={bootstrap.col10}>
                {getSize(product.attributes)}
                <div className={styles.widgetQty}>
                  <Quantity
                    key={id}
                    currentValue={value}
                    minValue={1}
                    maxValue={100}
                    onChange={handleChange}
                    class="my-quantity"
                    errorMsg="Available qty in stock is"
                  />
                </div>
              </div>
              <div
                className={cs(
                  bootstrap.col2,
                  globalStyles.textCenter,
                  styles.wishlistDisplay
                )}
              >
                <WishlistButton
                  id={product.id}
                  showText={false}
                  className="wishlist-font"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default LineItems;
