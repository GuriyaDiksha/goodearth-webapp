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
    openHeaderClassName,
    bodyClassName,
    closedIconClassName = cs(styles.arrow, styles.close),
    openIconClassName = cs(styles.arrow, styles.open),
    uniqueKey
  }) => {
    const bodyRef = useRef(new Array(sections.length));

    const [activeIndex, setActiveIndex] = useState(-1);

    const handleHeaderClick = (i: number, alwaysOpen: boolean | undefined) => {
      if (alwaysOpen) {
        return;
      }
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
      setActiveIndex(-1);
      sections.map(({ id, alwaysOpen }, i) => {
        if (id == defaultOpen) {
          setActiveIndex(i);
          if (bodyRef.current[i].scrollHeight > 15) {
            bodyRef.current[i].style.maxHeight =
              bodyRef.current[i].scrollHeight + "px";
          }
        }
        if (alwaysOpen) {
          bodyRef.current[i].style.maxHeight =
            bodyRef.current[i].scrollHeight + "px";
        }
      });
    }, [sections]);

    const accordionSections = sections.map(
      ({ id, header, body, alwaysOpen }, i) => {
        const isOpen = activeIndex == i;
        return (
          <div
            className={cs(styles.accordionSection, sectionClassName)}
            key={id}
            id={id}
          >
            <div
              className={cs(
                styles.accordionHeader,
                headerClassName,
                isOpen ? openHeaderClassName : ""
              )}
              onClick={() => handleHeaderClick(i, alwaysOpen)}
            >
              {header}
              {!alwaysOpen && (
                <span
                  className={cs(
                    { [closedIconClassName]: !isOpen },
                    { [openIconClassName]: isOpen }
                  )}
                ></span>
              )}
            </div>
            <div
              className={cs(styles.accordionBody)}
              ref={el => (bodyRef.current[i] = el)}
            >
              <div className={cs(bodyClassName)}>{body}</div>
            </div>
          </div>
        );
      }
    );
    return (
      <div className={className} key={uniqueKey}>
        {accordionSections}
      </div>
    );
  }
);

export default Accordion;
