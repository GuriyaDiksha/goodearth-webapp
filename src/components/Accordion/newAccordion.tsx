import React, { useEffect, useRef } from "react";
import { Props } from "./typings";
import cs from "classnames";
import styles from "./newStyles.scss";
import fontStyles from "styles/iconFonts.scss";

const NewAccordion: React.FC<Props> = ({
  sections,
  defaultOpen,
  className,
  headerClassName,
  headerClosedClassName,
  headerOpenClassName,
  bodyClassName,
  openClass = styles.arrowUp,
  closedClass = styles.arrowDown
}) => {
  const sectionsRef = useRef(new Array(sections.length));

  const handleHeaderClick = (event: any, i: number) => {
    console.log(sectionsRef.current[i]);
    const header = sectionsRef.current[i] as HTMLElement;
    const body = header.nextElementSibling as HTMLElement;
    if (header.classList.toggle(styles.active)) {
      header.children[0].classList.remove(closedClass);
      header.children[0].classList.add(openClass);
      body.style.maxHeight = body.scrollHeight + "px";
    } else {
      header.children[0].classList.remove(openClass);
      header.children[0].classList.add(closedClass);
      body.style.maxHeight = 0 + "px";
    }
    const items = sectionsRef.current;
    items.forEach(item => {
      if (
        item !== sectionsRef.current[i] &&
        item.classList.contains(styles.active)
      ) {
        item.classList.remove(styles.active);
        item.children[0].classList.remove(closedClass);
        item.children[0].classList.add(openClass);
        const itemBody = item.nextElementSibling as HTMLElement;
        itemBody.style.maxHeight = 0 + "px";
      }
    });
  };

  useEffect(() => {
    if (defaultOpen !== "") {
      const header = document.querySelector(
        `.${styles.accordionItemHeader}.${styles.active}`
      );
      const body = header?.nextElementSibling as HTMLElement;
      header?.children[0].classList.remove(closedClass);
      header?.children[0].classList.add(openClass);
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
          <span className={cs(fontStyles.icon, styles.arrowDown)}></span>
        </div>
        <div className={cs(styles.accordionItemBody)}>
          <div className={cs(styles.accordionItemBodyContent)}>{body}</div>
        </div>
      </div>
    );
  });

  return <div className={className}>{accordionSections}</div>;
};

export default NewAccordion;
