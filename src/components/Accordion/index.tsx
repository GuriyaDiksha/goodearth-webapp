import React, { memo, useState, useRef, useEffect } from "react";
import styles from "./styles.scss";
import { Props } from "./typings";
import cs from "classnames";

const Accordion: React.FC<Props> = memo(
  ({
    sections,
    defaultOpen,
    className,
    sectionClassName,
    headerClassName,
    bodyClassName,
    closedIconClassName = cs(styles.arrow, styles.close),
    openIconClassName = cs(styles.arrow, styles.open)
  }) => {
    const bodyRef = useRef(new Array(sections.length));

    const [activeIndex, setActiveIndex] = useState(-1);

    const handleHeaderClick = (i: number) => {
      if (activeIndex != -1) {
        const currentBody = bodyRef.current[activeIndex];
        currentBody.style.maxHeight = 0 + "px";
      }
      const newBody = bodyRef.current[i];
      if (activeIndex == i) {
        setActiveIndex(-1);
        newBody.style.maxHeight = 0 + "px";
      } else {
        setActiveIndex(i);
        newBody.style.maxHeight = newBody.scrollHeight + "px";
      }
    };

    useEffect(() => {
      if (defaultOpen != "") {
        sections.map(({ id }, i) => {
          if (id == defaultOpen) {
            handleHeaderClick(i);
          }
        });
      }
    }, []);

    const accordionSections = sections.map(({ id, header, body }, i) => {
      const isOpen = activeIndex == i;
      return (
        <div
          className={cs(styles.accordionSection, sectionClassName)}
          key={id}
          id={id}
        >
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
          <div
            className={cs(styles.accordionBody)}
            ref={el => (bodyRef.current[i] = el)}
          >
            <div className={cs(bodyClassName)}>{body}</div>
          </div>
        </div>
      );
    });
    return <div className={className}>{accordionSections}</div>;
  }
);

export default Accordion;
