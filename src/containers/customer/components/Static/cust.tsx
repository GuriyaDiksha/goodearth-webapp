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
import { updateCookiePrefrence } from "actions/info";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import { OLD_COOKIE_SETTINGS } from "constants/cookieConsent";

const mapStateToProps = (state: AppState) => {
  return {
    showCookiePref: state.info.showCookiePref
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    showCookiePrefs: () => {
      dispatch(updateCookiePrefrence(true));
    }
  };
};

class Cust extends React.Component<
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  {
    link: string;
    content: string;
    pageTitle: string;
    accordionData: AccordionData[];
  }
> {
  constructor(
    props: Props &
      ReturnType<typeof mapStateToProps> &
      ReturnType<typeof mapDispatchToProps>
  ) {
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

  showPref = () => {
    this.props.showCookiePrefs();
  };

  render() {
    const { pageTitle, content } = this.state;
    return (
      <div>
        <div className={styles.terms}>
          <div className={styles.pageTitle}>{pageTitle}</div>
          <div className={styles.description}>{content}</div>
          <Accordion
            uniqueKey="static-pages"
            sections={this.getSections()}
            className={styles.accordionClass}
            headerClassName={styles.accordionHeader}
            bodyClassName={styles.accordionBody}
            openIconClassName={cs(faqStyles.horizontal, faqStyles.open)}
            closedIconClassName={cs(faqStyles.horizontal)}
          />
          {/* {accordionData.map(({ content, heading, isAccordion }, index) => {
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
          })} */}
          {this.props?.path === "/customer-assistance/cookie-policy" &&
          !OLD_COOKIE_SETTINGS ? (
            <div className={styles.cookie} onClick={() => this.showPref()}>
              MANAGE COOKIE PREFRENCES
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cust);
