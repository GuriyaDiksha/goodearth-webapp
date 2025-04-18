import React, { useEffect, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { ShopLocatorProps } from "./typings";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import useOutsideDetection from "../../hooks/useOutsideDetetion";
import iconStyles from "../../styles/iconFonts.scss";
import { useHistory } from "react-router-dom";
import globalStyles from "../../styles/global.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

export const ShopLocator: React.FC<ShopLocatorProps> = ({
  goToShopLocator,
  saleStatus,
  dropdown,
  onChangeText,
  shopLocations,
  mobile,
  footerHeadingFontColor,
  footerHeadingHoverColor
}) => {
  const [menuOpen, setOpenState] = useState(dropdown || false);
  const [locations, setLocations] = useState(shopLocations);
  const [isHovered, setIsHovered] = useState(false);

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
    if (mobile) {
      if (menuOpen) {
        document.body.classList.remove(globalStyles.noScroll);
      } else {
        document.body.classList.add(globalStyles.noScroll);
      }
    }
  };

  const redirectToShop = (e: React.MouseEvent, data: any) => {
    if (data.label) {
      const stateName: string = data?.label.replace(/\s+/g, "-"); // Converts spaces to hyphens and makes lowercase
      history.push("/Cafe-Shop/" + stateName);
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "eventsToSend",
          eventAction: "shopCafeLocatorClick",
          eventCategory: "Click",
          eventLabel: location.pathname
        });
      }
      // dataLayer.push({
      //   event: 'Shop Locator',
      //   'Location Selected': data?.value,
      //   url: `${location.pathname}${location.search}`
      // });

      //load page from description
      setTimeout(() => {
        // scroll to desc always
        const banner = document.getElementById("page-banner") as HTMLDivElement;
        const h1 = banner.clientHeight;
        window.scrollTo({ top: h1, behavior: "smooth" });
      }, 100);
    }
  };

  const onOutsideClick = (event: MouseEvent) => {
    if (menuOpen) {
      setOpenState(false);
      if (mobile) {
        document.body.classList.remove(globalStyles.noScroll);
      }
    }
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
        style={{
          color: isHovered ? footerHeadingHoverColor : footerHeadingFontColor
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
            onKeyUp={onChange}
            readOnly={mobile}
          />
          <div
            className={
              menuOpen
                ? cs(styles.arrowRight, styles.arrowRightEnabled)
                : cs(styles.arrowRight)
            }
          ></div>
        </div>
        {locations?.length ? (
          <div
            className={
              menuOpen
                ? cs(styles.shopDropdown, styles.zindex)
                : cs(globalStyles.hidden)
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
                    <li
                      id={data.label}
                      key={index}
                      onClick={e => redirectToShop(e, data)}
                    >
                      <a>{data?.label.replace(/-/g, " ")}</a>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};
