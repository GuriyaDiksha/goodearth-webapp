import React, { memo, useMemo, useCallback } from "react";
import cs from "classnames";

import { Props } from "./typings";

import styles from "./styles.scss";

const SizeSelector: React.FC<Props> = ({
  sizes,
  selected,
  onChange,
  sizeClassName,
  isCorporatePDP,
  containerClassName
}) => {
  const getSizeClickHandler = useCallback(
    child => {
      return () => {
        onChange && onChange(child);
      };
    },
    [sizes, selected]
  );

  const sizesHTML = useMemo(() => {
    return sizes.map(child => {
      const { id, size, stock, sku } = child;
      return (
        <div
          key={sku}
          className={cs(styles.sizeButton, sizeClassName, {
            [styles.selected]: id === selected,
            [styles.unavailable]: stock === 0 && !isCorporatePDP
          })}
          onClick={getSizeClickHandler(child)}
        >
          {size}
        </div>
      );
    });
  }, [sizes, selected]);
  return (
    <div className={cs(styles.sizeSelector, containerClassName)}>
      {sizesHTML}
    </div>
  );
};

export default memo(SizeSelector);
