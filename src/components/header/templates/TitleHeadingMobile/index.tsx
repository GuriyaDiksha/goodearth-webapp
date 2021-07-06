import {
  MenuComponent,
  MenuComponentTitleData
} from "components/header/typings";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "reducers/typings";
import styles from "../styles.scss";
import ReactHtmlParser from "react-html-parser";
import { getInnerText } from "utils/validate";

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
const TitleHeadingMobile: React.FC<Props> = ({
  data,
  templateType,
  l1,
  onHeaderMegaMenuClick
}) => {
  const componentData = data.componentData as MenuComponentTitleData;
  const { mobile } = useSelector((state: AppState) => state.device);
  return (
    <div className={styles.titleHeadingMobile}>
      <div className={styles.featuredMobileContainer}>
        {componentData.src && (
          <Link
            to={componentData.link}
            onClick={() =>
              onHeaderMegaMenuClick({
                l1,
                l2: componentData.title,
                // l3: componentData.title,
                clickUrl2: componentData.link,
                template: templateType,
                img2: mobile
                  ? componentData.thumbnailSrc || componentData.src || ""
                  : componentData.src || ""
              })
            }
          >
            <img
              className={styles.img}
              src={componentData.thumbnailSrc || componentData.src}
              alt={getInnerText(componentData.title)}
            />
          </Link>
        )}
        <div className={styles.container}>
          <div className={styles.blockHeading}>
            <Link
              className={styles.heading}
              to={componentData.link}
              onClick={() =>
                onHeaderMegaMenuClick({
                  l1,
                  l2: componentData.title,
                  clickUrl2: componentData.link,
                  template: templateType
                })
              }
            >
              {ReactHtmlParser(componentData.title)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleHeadingMobile;
