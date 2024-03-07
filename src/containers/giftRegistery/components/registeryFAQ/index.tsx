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

const RegisteryFAQ: React.FC<Props> = ({ mobile }) => {
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

  useEffect(() => {
    if (mobile) {
      bodyRef.current.map(ref => {
        ref.style.maxHeight = 0 + "px";
      });
      bodyRef.current[currentActive].style.maxHeight =
        bodyRef.current[currentActive].scrollHeight + 500 + "px";
    }
  });

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
          [styles.mobile]: mobile
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

export default RegisteryFAQ;
