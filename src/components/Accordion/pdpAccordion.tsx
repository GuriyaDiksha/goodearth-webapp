import React, { memo, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { Props } from "./typings";
import Header from "./header";
import Body from "./body";
//import iconStyles from "styles/iconFonts.scss";

const PdpAccordion: React.FC<Props> = memo(
  ({
    sections,
    defaultOpen,
    className,
    headerClassName,
    headerClosedClassName,
    bodyClassName,
    openClass = styles.arrowUp,
    closedClass = styles.arrowDown
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
            openIconClass={openClass}
            closedIconClass={closedClass}
            onClick={onHeaderClick}
            className={headerClassName}
            headerClosedClassName={headerClosedClassName}
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

export default PdpAccordion;
