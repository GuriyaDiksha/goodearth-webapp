import React, { memo, useState, useEffect } from "react";
import cs from "classnames";
import { Link } from "react-router-dom";
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

const CartItems: React.FC<BasketItem> = memo(
  ({
    id,
    bridalProfile,
    giftCardImage,
    quantity,
    product,
    currency,
    saleStatus,
    GCValue,
    onMoveToWishlist
  }) => {
    const [value, setValue] = useState(quantity | 0);
    const { dispatch } = useStore();

    useEffect(() => {
      setValue(quantity);
    }, [quantity]);

    const handleChange = async (value: number) => {
      await BasketService.updateToBasket(dispatch, id, value).then(res => {
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
      return size ? (
        <div>
          <div className={styles.size}>Size: </div>
          <div>{size.value}</div>
        </div>
      ) : (
        ""
      );
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
      <div className={cs(styles.cartItem, styles.gutter15, styles.cart)}>
        <div className={bootstrap.row}>
          <div
            className={cs(bootstrap.col5, bootstrap.colMd2, styles.cartPadding)}
          >
            <div className={styles.cartRing}></div>
            <Link to={url}>
              <img
                className={styles.productImage}
                src={plpImages ? plpImages[0] : ""}
              />
            </Link>
          </div>
          <div
            className={cs(bootstrap.colMd8, bootstrap.col5, styles.cartPadding)}
          >
            <div className={styles.rowMain}>
              <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
                <div className={cs(styles.section, styles.sectionInfo)}>
                  <div>
                    <div className={styles.collectionName}>
                      {collections[0]}
                    </div>
                    <div className={styles.productName}>
                      <Link to={url}>{title}</Link>
                    </div>
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
                        {product.structure == "GiftCard" ? GCValue : price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
                <div className={cs(styles.section, styles.sectionMiddle)}>
                  <div className={styles.productSize}>
                    {getSize(product.attributes)}
                  </div>
                  <div>
                    <div className={styles.size}>QTY</div>
                    <div className={styles.widgetQty}>
                      <Quantity
                        source="cartpage"
                        key={id}
                        id={id}
                        currentValue={value}
                        minValue={1}
                        maxValue={1000}
                        onChange={x => null}
                        onUpdate={handleChange}
                        class="my-quantity"
                        // errorMsg="Available qty in stock is"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={cs(
              bootstrap.colMd2,
              bootstrap.col2,
              globalStyles.textCenter,
              styles.cartPadding
            )}
          >
            <div className={styles.section}>
              <div className={cs(styles.pointer, styles.remove)}>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.crossiconItem
                  )}
                  onClick={deleteItem}
                ></i>
              </div>
              <div>
                <WishlistButton
                  basketLineId={id}
                  id={product.id}
                  showText={false}
                  onMoveToWishlist={onMoveToWishlist}
                  className="wishlist-font"
                />
              </div>
            </div>
          </div>
        </div>
        <hr className={styles.hr} />
      </div>
    );
  }
);

export default CartItems;
