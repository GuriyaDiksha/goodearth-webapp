import React, { useEffect, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { ShopLocatorProps } from "./typings";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import useOutsideDetection from "../../hooks/useOutsideDetetion";
import iconStyles from "../../styles/iconFonts.scss";
import { useHistory } from "react-router-dom";
import globalStyles from "../../styles/global.scss";

export const ShopLocator: React.FC<ShopLocatorProps> = ({
  goToShopLocator,
  saleStatus,
  dropdown,
  onChangeText,
  shopLocations,
  mobile
}) => {
  const [menuOpen, setOpenState] = useState(dropdown || false);
  const [locations, setLocations] = useState(shopLocations);

  useEffect(() => {
    setLocations(shopLocations);
  }, [shopLocations.length]);

  const onChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value.toLowerCase();
    const filteredLocations = locations?.filter(location => {
      return location.label.toLowerCase().indexOf(text) > -1;
    });
    setLocations(text ? filteredLocations : shopLocations);
    onChangeText(event);
  };
  const history = useHistory();

  const onInsideClick = () => {
    setOpenState(!menuOpen);
  };

  const redirectToShop = (e: React.MouseEvent, data: any) => {
    if (data.label) {
      history.push("/Cafe-Shop/" + data.label);
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "shopCafeLocatorClick",
        eventCategory: "Click",
        eventLabel: location.pathname
      });
      // dataLayer.push({
      //   event: 'Shop Locator',
      //   'Location Selected': data?.value,
      //   url: `${location.pathname}${location.search}`
      // });
    }
  };

  const onOutsideClick = (event: MouseEvent) => {
    setOpenState(false);
  };

  const { ref } = useOutsideDetection<HTMLDivElement>(onOutsideClick);
  return (
    <div
      className={cs(styles.shopLocator, {
        [styles.ftrHeading80blkSale]: saleStatus
      })}
    >
      <div
        className={cs(styles.cursorPointer, globalStyles.pointer)}
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
                iconStyles.iconLocation,
                styles.iconStore
              )}
            ></i>
          </span>
          <input
            type="text"
            placeholder="city, country"
            id="drop"
            autoComplete="off"
            disabled
            onKeyUp={onChange}
          />
          <div
            className={
              menuOpen
                ? cs(styles.arrowRight, styles.arrowRightEnabled)
                : cs(styles.arrowRight)
            }
          ></div>
        </div>
        <div
          className={
            menuOpen ? cs(styles.shopDropdown) : cs(globalStyles.hidden)
          }
        >
          <ul>
            {mobile && (
              <li className={styles.header}>
                <div className={styles.locatorLabel}>
                  <span className={cs(styles.location)}>
                    <i
                      className={cs(
                        iconStyles.icon,
                        iconStyles.iconLocation,
                        styles.iconStore
                      )}
                    ></i>
                    <span className={styles.label}>City, Country</span>
                  </span>
                </div>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.iconCross
                  )}
                ></i>
              </li>
            )}
            {locations?.map(
              (data: { label: string; value: string }, index: number) => {
                return (
                  <li key={index} onClick={e => redirectToShop(e, data)}>
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
