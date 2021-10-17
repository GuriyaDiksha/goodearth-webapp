import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import L2 from "../menuComponents/L2";

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
const L2L3: React.FC<Props> = props => {
  return (
    <div className={styles.l2l3}>
      <L2 {...props} />
    </div>
  );
};

export default L2L3;
