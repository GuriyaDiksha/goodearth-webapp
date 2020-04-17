import React, { useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { ShopLocatorProps } from "./typings";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import useOutsideDetection from "../../hooks/useOutsideDetetion";
import iconStyles from "../../styles/iconFonts.scss";

export const ShopLocator: React.FC<ShopLocatorProps> = ({
  goToShopLocator,
  saleStatus,
  dropdown,
  onChangeText,
  shopLocations
}) => {
  const [menuOpen, setOpenState] = useState(dropdown || false);
  // const [setOpenState] = useState(dropdown || false);
  // false && setOpenState(false);

  const onInsideClick = () => {
    setOpenState(!menuOpen);
  };

  const onOutsideClick = (event: MouseEvent) => {
    setOpenState(false);
  };

  const { ref } = useOutsideDetection<HTMLDivElement>(onOutsideClick);
  return (
    <div
      className={cs(
        styles.shopLocator,
        saleStatus ? styles.ftrHeading80blkSale : styles.ftrHeadingWhite
      )}
    >
      <div
        className={cs(styles.cursorPointer)}
        onClick={e => goToShopLocator(e, null)}
      >
        Shop & cafe Locator
      </div>
      <div className={cs(bootstrap.ColMd)} onClick={onInsideClick} ref={ref}>
        <div className={cs(styles.formFooter)}>
          <span className={cs(styles.location)}>
            <i
              className={cs(
                { [styles.iconClass]: menuOpen },
                iconStyles.icon,
                iconStyles.iconLocation
              )}
            ></i>
          </span>
          <input
            type="text"
            placeholder="city, country"
            id="drop"
            autoComplete="new-password"
            onKeyUp={onChangeText}
            // onClick={showDropdown(true)}
          />
          <div
            className={
              menuOpen
                ? cs(styles.arrowRight, styles.arrowRightEnabled)
                : cs(styles.arrowRight)
            }
          ></div>
        </div>
        <div className={menuOpen ? cs(styles.shopDropdown) : cs(styles.hidden)}>
          <ul>
            {shopLocations.map(
              (data: { label: string; value: string }, index: number) => {
                return (
                  <li key={index} onClick={e => goToShopLocator(e, data)}>
                    <a>{data.label}</a>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
