import React, { useMemo, useState } from "react";
import cs from "classnames";
// data
import { faqs } from "./data";
// components
import Accordion from "components/Accordion";
// typings
import { Props } from "./typings";
import { Section } from "components/Accordion/typings";
// styles
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";

const WallpaperFAQ: React.FC<Props> = ({ mobile }) => {
  const [currentActive, setCurrentActive] = useState(0);

  const accordionSections = useMemo(() => {
    const sections: Array<Section[]> = faqs.map(faq => {
      return faq.questions.map((question, c) => {
        return {
          header: question.ques,
          body: question.answer,
          id: c.toString()
        };
      });
    });

    return sections;
  }, []);

  const onHeaderClick = (index: number) => {
    return () => {
      setCurrentActive(index);
    };
  };

  const headers = useMemo(() => {
    return faqs.map((section, i) => {
      return (
        <div
          className={cs(styles.headerSection, {
            [styles.active]: i === currentActive
          })}
          key={i}
          onClick={mobile ? undefined : onHeaderClick(i)}
        >
          {!mobile && section.icon}
          <div
            className={styles.sectionTitle}
            onClick={mobile ? onHeaderClick(i) : undefined}
          >
            {section.text}
          </div>
          {mobile && (
            <div
              className={cs(styles.mobileFaqContainer, {
                [styles.active]: currentActive === i
              })}
            >
              <Accordion
                sections={accordionSections[i]}
                headerClassName={styles.accordionTitle}
                bodyClassName={styles.accordionText}
                openIconClass={styles.openIcon}
                closedIconClass={styles.closeIcon}
                defaultOpen="0"
              />
            </div>
          )}
        </div>
      );
    });
  }, [currentActive, mobile]);

  return (
    <>
      <div
        className={cs(bootstrap.row, {
          [styles.mobile]: mobile,
          [globalStyles.bgGrey]: !mobile
        })}
      >
        <div
          className={cs(
            globalStyles.textCenter,
            bootstrap.col12,
            bootstrap.colLg10,
            bootstrap.offsetLg1,
            styles.container
          )}
        >
          <h2>FAQ</h2>
          <div className={styles.headerSections}>{headers}</div>
        </div>
      </div>
      {!mobile && (
        <div className={cs(styles.faqsContainer, bootstrap.row)}>
          <div
            className={cs(
              bootstrap.colMd8,
              bootstrap.offsetMd2,
              bootstrap.col10,
              bootstrap.offset1
            )}
          >
            <Accordion
              sections={accordionSections[currentActive]}
              headerClassName={styles.accordionTitle}
              bodyClassName={styles.accordionText}
              openIconClass={styles.openIcon}
              closedIconClass={styles.closeIcon}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WallpaperFAQ;
