import React, { memo, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { Props } from "./typings";
import Header from "./header";
import Body from "./body";

const Accordion: React.FC<Props> = memo(
  ({
    sections,
    defaultOpen,
    className,
    headerClassName,
    bodyClassName,
    openIconClass = styles.iconClose,
    closedIconClass = styles.iconOpe
  }) => {
    const [activeSection, setActiveSection] = useState(defaultOpen);

    const onHeaderClick = (id: string) => {
      if (activeSection === id) {
        setActiveSection(undefined);
      } else {
        setActiveSection(id);
      }
    };

    const accordionSections = sections.map(({ id, header, body }) => {
      return (
        <div className={styles.accordionSection} key={id}>
          <Header
            id={id}
            open={activeSection === id}
            openIconClass={openIconClass}
            closedIconClass={closedIconClass}
            onClick={onHeaderClick}
            className={headerClassName}
          >
            {header}
          </Header>
          <Body open={activeSection === id} className={bodyClassName}>
            {body}
          </Body>
        </div>
      );
    });

    return <div className={cs(className)}>{accordionSections}</div>;
  }
);

export default Accordion;
