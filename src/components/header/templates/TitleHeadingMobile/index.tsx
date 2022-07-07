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
    <>
      {data?.children?.map((child: any, ind: number) => (
        <div className={styles.titleHeadingMobile} key={ind}>
          <div className={styles.featuredMobileCosntainer}>
            {child.componentData?.src && (
              <Link
                to={child.componentData?.link}
                target={child.componentData.openInNewTab ? "_blank" : ""}
                onClick={() =>
                  onHeaderMegaMenuClick({
                    l1,
                    l2: child.componentData.title,
                    // l3: componentData.title,
                    clickUrl2: child.componentData.link,
                    template: templateType,
                    img2: mobile
                      ? componentData.thumbnailSrc || componentData.src || ""
                      : componentData.src || ""
                  })
                }
              >
                <img
                  className={styles.img}
                  src={
                    child.componentData.thumbnailSrc || child.componentData.src
                  }
                  alt={getInnerText(child.componentData.title)}
                />
              </Link>
            )}
            <div className={styles.container}>
              <div className={styles.blockHeading}>
                <Link
                  className={styles.mobileTitle}
                  to={componentData.link}
                  target={componentData.openInNewTab ? "_blank" : ""}
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
              <div className={styles.blockHeading}>
                <Link
                  className={styles.mobileHeading}
                  to={child.componentData.link}
                  target={child.componentData.openInNewTab ? "_blank" : ""}
                  onClick={() =>
                    onHeaderMegaMenuClick({
                      l1,
                      l2: child.componentData.heading,
                      clickUrl2: child.componentData.link,
                      template: templateType
                    })
                  }
                >
                  {ReactHtmlParser(
                    child.componentData.heading || child.componentData.title
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TitleHeadingMobile;
