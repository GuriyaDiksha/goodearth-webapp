import React from "react";
import cs from "classnames";
import DropdownMenu from "./dropdownMenu";
import SelectableDropdownMenu from "./selectableDropdownMenu";
import { DropdownItem } from "./baseDropdownMenu/typings";

import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import storyStyles from "../../styles/stories.scss";
import iconStyles from "../../styles/iconFonts.scss";

require("../../fonts/goodearth.ttf");

export default { title: "Dropdowns" };

export const staticMenu = () => {
  const items: DropdownItem[] = [
    {
      href: "/about",
      label: "About",
      type: "link",
      onClick: () => {
        alert("About");
      }
    }
  ];
  return (
    <div className={styles.row}>
      <div className={styles.colMd3}>
        <label>Left Align</label>
        <br />
        <DropdownMenu
          display={<span>INR</span>}
          className={storyStyles.greyBG}
          align="left"
          items={items}
        ></DropdownMenu>
      </div>
      <div className={styles.colMd3}>
        <label>Right Align</label>
        <br />
        <DropdownMenu
          display={<span>INR</span>}
          className={storyStyles.greyBG}
          align="right"
          items={items}
        ></DropdownMenu>
      </div>
    </div>
  );
};

export const selectable = () => {
  const items: DropdownItem[] = [
    {
      label: "INR",
      value: "INR"
    },
    {
      label: "USD",
      value: "USD"
    }
  ];
  return (
    <div className={styles.row}>
      <div className={styles.colMd3}>
        <label>Left Align</label>
        <br />
        <SelectableDropdownMenu
          align="left"
          className={storyStyles.greyBG}
          items={items}
          value="INR"
        ></SelectableDropdownMenu>
      </div>
      <div className={styles.colMd3}>
        <label>Right Align</label>
        <br />
        <SelectableDropdownMenu
          align="right"
          className={storyStyles.greyBG}
          items={items}
          value="USD"
        ></SelectableDropdownMenu>
      </div>
    </div>
  );
};

export const Icons = () => {
  return (
    <div className={styles.colMd12}>
      <span>Icon Wishlist:&nbsp;</span>
      <span className={cs(iconStyles.icon, iconStyles.iconWishlist)}></span>
      <br />
      <span>Icon Wishlist Added:&nbsp;</span>
      <span
        className={cs(iconStyles.icon, iconStyles.iconWishlistAdded)}
      ></span>
      <br />
      <span>Icon Profile:&nbsp;</span>
      <span className={cs(iconStyles.icon, iconStyles.iconProfile)}></span>
      <br />
      <span>Icon Cart:&nbsp;</span>
      <span className={cs(iconStyles.icon, iconStyles.iconCart)}></span>
      <br />
      <span>Icon Search:&nbsp;</span>
      <span className={cs(iconStyles.icon, iconStyles.iconSearch)}></span>
    </div>
  );
};
