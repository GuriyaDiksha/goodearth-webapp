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
const TitleHeading: React.FC<Props> = props => {
  return (
    <div className={styles.titleHeading}>
      <Title {...props} />
    </div>
  );
};

export default TitleHeading;
