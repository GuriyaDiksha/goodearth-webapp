import React from "react";
import styles from "../styles.scss";
import { Props } from "../../typings";
import ReactHtmlParser from "react-html-parser";
import { scrollToId, removeFroala } from "utils/validate";

export default class Cust extends React.Component<Props, { content: string }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      content: ""
    };
    props.setCurrentSection();
  }
  saleStatus = true;
  componentDidMount() {
    this.props.fetchTerms().then(res => {
      this.setState({
        content: res.content
      });
      // for handling scroll to particular element with id
      scrollToId();
      removeFroala();
    });
  }
  render() {
    return (
      <div>
        <div className={styles.terms}>
          {ReactHtmlParser(this.state.content)}
        </div>
      </div>
    );
  }
}
