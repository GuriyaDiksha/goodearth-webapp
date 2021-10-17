import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import Title from "../menuComponents/Title";

type Props = {
  data: MenuComponent;
  templateType: string;
  l1: string;
  onHeaderMegaMenuClick: ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3,
    template,
    img2,
    img3,
    cta,
    subHeading
  }: {
    [x: string]: string;
  }) => void;
};
const Content: React.FC<Props> = props => {
  return (
    <div className={styles.content}>
      <Title {...props} />
    </div>
  );
};

export default Content;
