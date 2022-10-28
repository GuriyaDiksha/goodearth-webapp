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
      const cont = ReactHtmlParser(res.content).filter((e: any) => {
        return e.props["data-f-id"] != "pbf";
      });
      this.setState({
        content: cont,
        pageTitle: res.pageTitle,
        link: res.link,
        accordionData: res.accordionData
      });
      removeFroala();
      scrollToId();
    });
  }
  render() {
    const { pageTitle, content, accordionData } = this.state;

    return (
      <div>
        <div className={styles.terms}>
          <div className={styles.pageTitle}>{pageTitle}</div>
          <div className={styles.description}>{content}</div>
          {accordionData.map(({ content, heading, isAccordion }, index) => {
            if (isAccordion) {
              const cont = ReactHtmlParser(content).filter((e: any) => {
                return e.props["data-f-id"] != "pbf";
              });
              const section = ([
                { header: heading, body: cont, id: index }
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
