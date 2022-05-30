import React, { useEffect } from "react";
import { Props } from "./typings";
import cs from "classnames";
import styles from "./newStyles.scss";

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
  const handleHeaderClick = (event: any) => {
    const header = event.target as HTMLElement;
    const body = header.nextElementSibling as HTMLElement;
    if (header.classList.toggle("active")) {
      body.style.maxHeight = body.scrollHeight + "px";
    } else {
      body.style.maxHeight = 0 + "px";
    }
    const items = document.querySelectorAll(`.${styles.accordionItemHeader}`);
    items.forEach(item => {
      if (item !== event.target) {
        item.classList.remove("active");
        const itemBody = item.nextElementSibling as HTMLElement;
        itemBody.style.maxHeight = 0 + "px";
      }
    });
  };

  useEffect(() => {
    if (defaultOpen !== "") {
      console.log();
      const header = document.querySelector(
        `.${styles.accordionItemHeader}.active`
      );
      const body = header?.nextElementSibling as HTMLElement;
      if (header && header.classList.toggle("active")) {
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = 0 + "px";
      }
    }
  }, []);

  const accordionSections = sections.map(({ id, header, body }) => {
    return (
      <div className={cs(styles.accordionItem)} id={id} key={id}>
        <div
          className={cs(styles.accordionItemHeader, {
            ["active"]: id == defaultOpen
          })}
          onClick={e => {
            handleHeaderClick(e);
          }}
        >
          {header}
        </div>
        <div className={cs(styles.accordionItemBody)}>
          <div className={cs(styles.accordionItemBodyContent)}>{body}</div>
        </div>
      </div>
    );
  });

  return <div className="accordion">{accordionSections}</div>;
};

export default NewAccordion;
