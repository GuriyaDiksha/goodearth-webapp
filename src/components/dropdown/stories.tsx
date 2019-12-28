import React from "react";
import DropdownMenu from "./dropdownMenu";
import SelectableDropdownMenu from "./selectableDropdownMenu";
import { DropdownItem } from "./baseDropdownMenu/typings";

import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import storyStyles from "../../styles/stories.scss";

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
