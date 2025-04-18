import React, { useMemo, useState, useRef, useEffect } from "react";
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
  const bodyRef = useRef(new Array(faqs.length));

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
    setCurrentActive(index);
  };

  useEffect(() => {
    if (mobile) {
      bodyRef.current.map(ref => {
        ref.style.maxHeight = 0 + "px";
      });
      bodyRef.current[currentActive].style.maxHeight =
        bodyRef.current[currentActive].scrollHeight + 500 + "px";
    }
  });

  const headers = useMemo(() => {
    return faqs.map((section, i) => {
      return (
        <div
          className={cs(styles.headerSection, {
            [styles.active]: i === currentActive
          })}
          key={i}
          onClick={() => onHeaderClick(i)}
        >
          {!mobile && i === currentActive && section.iconAqua}
          {!mobile && i !== currentActive && section.icon}
          <div className={styles.sectionTitle} onClick={() => onHeaderClick(i)}>
            {mobile && i === currentActive && section.iconAqua}
            {mobile && i !== currentActive && section.icon}
            {mobile && <span>{section.text}</span>}
            {!mobile && section.text}
          </div>
          {mobile && (
            <div
              className={cs(styles.mobileFaqContainer, {
                [styles.active]: currentActive === i
              })}
              ref={el => (bodyRef.current[i] = el)}
            >
              <Accordion
                sections={accordionSections[i]}
                className="mobileWallpaperFAQ"
                headerClassName={styles.accordionTitle}
                bodyClassName={styles.accordionText}
                openIconClassName={cs(styles.horizontal, styles.open)}
                closedIconClassName={cs(styles.horizontal)}
              />
            </div>
          )}
        </div>
      );
    });
  }, [currentActive, mobile]);

  const getAccordion = (index: number) => {
    return (
      <Accordion
        className="wallpaperFAQ"
        sections={accordionSections[index]}
        headerClassName={styles.accordionTitle}
        bodyClassName={styles.accordionText}
        openIconClassName={cs(styles.horizontal, styles.open)}
        closedIconClassName={cs(styles.horizontal)}
        uniqueKey={index.toString()}
      />
    );
  };

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
          <h2>Frequently Asked Questions</h2>
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
            {getAccordion(currentActive)}
          </div>
        </div>
      )}
    </>
  );
};

export default WallpaperFAQ;
