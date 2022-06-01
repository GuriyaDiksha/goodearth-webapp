import React, { memo, useState } from "react";
import styles from "./styles.scss";
import { Props } from "./typings";
import cs from "classnames";

const Accordion: React.FC<Props> = memo(
  ({
    sections,
    className,
    headerClassName,
    closedIconClassName = cs(styles.arrow, styles.close),
    openIconClassName = cs(styles.arrow, styles.open)
  }) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const handleHeaderClick = (i: number) => {
      if (activeIndex == i) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(i);
      }
      return;
    };

    const accordionSections = sections.map(({ id, header, body }, i) => {
      const isOpen = activeIndex == i;
      return (
        <div className={cs(styles.accordionSection)} key={id} id={id}>
          <div
            className={cs(styles.accordionHeader, headerClassName)}
            onClick={() => handleHeaderClick(i)}
          >
            {header}
            <span
              className={cs(
                { [closedIconClassName]: !isOpen },
                { [openIconClassName]: isOpen }
              )}
            ></span>
          </div>
        </div>
      );
    });
    return <div className={className}>{accordionSections}</div>;
  }
);

export default Accordion;
