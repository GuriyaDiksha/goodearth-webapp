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

  getSections = () => {
    const sections: Section[] = [];
    this.state.accordionData.map(({ content, heading, isAccordion }, index) => {
      const cont = ReactHtmlParser(content).filter((e: any) => {
        if (e.props) {
          return e.props["data-f-id"] != "pbf";
        } else {
          return true;
        }
      });
      const section = ({
        header: heading,
        body: cont,
        id: index,
        alwaysOpen: !isAccordion
      } as unknown) as Section;
      sections.push(section);
    });
    return sections;
  };

  render() {
    const { pageTitle, content } = this.state;

    return (
      <div>
        <div className={styles.terms}>
          <div className={styles.pageTitle}>{pageTitle}</div>
          <div className={styles.description}>{content}</div>
          <Accordion
            sections={this.getSections()}
            className={styles.accordionClass}
            headerClassName={styles.accordionHeader}
            openHeaderClassName={styles.accordionHeaderOpen}
            bodyClassName={styles.accordionBody}
            openIconClassName={cs(faqStyles.horizontal, faqStyles.open)}
            closedIconClassName={cs(faqStyles.horizontal)}
          />
        </div>
      </div>
    );
  }
}
