import React, { useState, useEffect } from "react";
import { SecondaryHeaderDropdownMenuProps } from "./typings";
import cs from "classnames";
import useOutsideDetection from "../../../hooks/useOutsideDetetion";
import styles from "./styles.scss";

const SecondaryHeaderDropdown = ({
  id,
  value,
  onChange,
  items,
  className
}: SecondaryHeaderDropdownMenuProps) => {
  const [menuOpen, setOpenState] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const onInsideClick = () => {
    setOpenState(!menuOpen);
    const elem = document.getElementById(id) as HTMLDivElement;
    if (elem) {
      if (!elem.style.maxHeight) {
        elem.style.maxHeight = elem.scrollHeight + "px";
      } else {
        elem.style.removeProperty("max-height");
      }
    }
  };

  const onOutsideClick = (event: MouseEvent) => {
    setOpenState(false);
    const elem = document.getElementById(id) as HTMLDivElement;
    if (elem) {
      elem.style.removeProperty("max-height");
    }
  };

  const handleItemClick = (item: any) => {
    onInsideClick();
    setOpenState(false);
    onChange(item.value, item.label);
  };

  useEffect(() => {
    let val = "";
    items.map(item => {
      if (item.value == value) {
        val = item.label;
      }
    });
    setDisplayValue(val);
  }, [value]);

  const { ref } = useOutsideDetection<HTMLDivElement>(onOutsideClick);

  return (
    <div className={cs(styles.container)} ref={ref}>
      <div className={cs(styles.label, className)} onClick={onInsideClick}>
        <span className={cs(styles.labelText)}>{displayValue}</span>
        <span
          className={cs(styles.labelIcon, styles.caret, {
            [styles.caretUp]: menuOpen
          })}
        ></span>
      </div>
      <div
        id={id}
        className={cs(styles.listContainer, { [styles.open]: menuOpen })}
      >
        <ul>
          {items.map(item => {
            if (item.label != value) {
              return (
                <li
                  key={item.id}
                  onClick={() => {
                    handleItemClick(item);
                  }}
                >
                  {item.label}
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default SecondaryHeaderDropdown;
