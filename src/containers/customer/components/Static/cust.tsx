import React from "react";
import Accordion from "components/Accordion";
import styles from "../styles.scss";
import { Props } from "../../typings";
import ReactHtmlParser from "react-html-parser";
import cs from "classnames";
import { scrollToId, removeFroala } from "utils/validate";
import { AccordionData } from "../../typings";
import { Section } from "components/Accordion/typings";
import faqStyles from "containers/pdp/components/WallpaperFAQ/styles.scss";

export default class Cust extends React.Component<
  Props,
  {
    link: string;
    content: string;
    pageTitle: string;
    accordionData: AccordionData[];
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      content: "",
      pageTitle: "",
      accordionData: [],
      link: ""
    };
    props.setCurrentSection();
  }
  saleStatus = true;
  componentDidMount() {
    this.props.fetchTerms().then(res => {
      this.setState({
        content: res.content,
        pageTitle: res.pageTitle,
        link: res.link,
        accordionData: res.accordionData
      });
      scrollToId();
      removeFroala();
    });
  }
  render() {
    const { pageTitle, content, accordionData } = this.state;

    return (
      <div>
        <div className={styles.terms}>
          <div className={styles.pageTitle}>{pageTitle}</div>
          <div className={styles.description}>{ReactHtmlParser(content)}</div>
          {accordionData.map(({ content, heading, isAccordion }, index) => {
            if (isAccordion) {
              const section = ([
                { header: heading, body: ReactHtmlParser(content), id: index }
              ] as unknown) as Section[];
              return (
                <Accordion
                  sections={section}
                  className={styles.accordionClass}
                  headerClassName={styles.accordionHeader}
                  bodyClassName={styles.accordionBody}
                  openIconClassName={cs(faqStyles.horizontal, faqStyles.open)}
                  closedIconClassName={cs(faqStyles.horizontal)}
                />
              );
            } else {
              return (
                <div className={styles.noAccordion}>
                  <div className={styles.contentHeading}>{heading}</div>
                  <div className={styles.content}>
                    {ReactHtmlParser(content)}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}
