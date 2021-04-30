import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import Image from "../menuComponents/Image";

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
const ImageWithSideSubheadingMobile: React.FC<Props> = ({
  data,
  templateType,
  l1,
  onHeaderMegaMenuClick
}) => {
  return (
    <div className={styles.imageWithSideSubheadingMobile}>
      {data.children && data.children.length > 0 && (
        <Image
          data={data.children}
          templateType={templateType}
          l1={l1}
          onHeaderMegaMenuClick={onHeaderMegaMenuClick}
        />
      )}
    </div>
  );
};

export default ImageWithSideSubheadingMobile;
