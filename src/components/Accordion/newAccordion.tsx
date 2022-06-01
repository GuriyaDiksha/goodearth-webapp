import React, { useEffect, useRef, memo } from "react";
import { Props } from "./typings";
import cs from "classnames";
import styles from "./newStyles.scss";

const NewAccordion: React.FC<Props> = memo(
  ({
    sections,
    defaultOpen,
    className,
    headerClassName,
    headerClosedClassName,
    headerOpenClassName,
    bodyClassName,
    closedIconClass,
    openIconClass,
    openClass = styles.arrowUp,
    closedClass = styles.arrowDown
  }) => {
    const sectionsRef = useRef(new Array(sections.length));

    closedClass = closedIconClass ? closedIconClass : styles.arrowUp;
    openClass = openIconClass ? openIconClass : styles.arrowDown;

    const handleHeaderClick = (event: any, i: number) => {
      const header = sectionsRef.current[i] as HTMLElement;
      const body = header.nextElementSibling as HTMLElement;
      if (header.classList.toggle(styles.active)) {
        body.style.maxHeight = body.scrollHeight + "px";
        header.children[0].classList.remove(closedClass);
        header.children[0].classList.add(openClass);
      } else {
        body.style.maxHeight = 0 + "px";
      }
      const items = sectionsRef.current;
      items.forEach(item => {
        if (
          item !== sectionsRef.current[i] &&
          item.classList.contains(styles.active)
        ) {
          item.classList.remove(styles.active);
          const itemBody = item.nextElementSibling as HTMLElement;
          itemBody.style.maxHeight = 0 + "px";
        }
      });
    };

    useEffect(() => {
      if (defaultOpen !== "") {
        const header = sectionsRef.current.filter(el =>
          el.classList.contains(styles.active)
        )[0] as HTMLElement;
        const body = header.nextElementSibling as HTMLElement;
        body.style.maxHeight = body.scrollHeight + "px";
      }
    }, []);

    const accordionSections = sections.map(({ id, header, body }, i) => {
      return (
        <div className={cs(styles.accordionItem)} id={id} key={id}>
          <div
            className={cs(styles.accordionItemHeader, {
              [styles.active]: id == defaultOpen
            })}
            onClick={e => {
              handleHeaderClick(e, i);
            }}
            ref={el => (sectionsRef.current[i] = el)}
          >
            {header}
            <span
              className={cs(
                { [styles.arrowDown]: !closedIconClass },
                { [closedIconClass || ""]: closedIconClass }
              )}
            ></span>
          </div>
          <div className={cs(styles.accordionItemBody)}>
            <div className={cs(styles.accordionItemBodyContent)}>{body}</div>
          </div>
        </div>
      );
    });

    return <div className={className}>{accordionSections}</div>;
  }
);

export default NewAccordion;
