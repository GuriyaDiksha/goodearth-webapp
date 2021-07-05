import {
  MenuComponent,
  MenuComponentTitleData
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";
import Image from "./Image";
import ReactHtmlParser from "react-html-parser";

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
const Title: React.FC<Props> = ({
  data,
  templateType,
  l1,
  onHeaderMegaMenuClick
}) => {
  const componentData = data.componentData as MenuComponentTitleData;
  return (
    <>
      <div className={styles.blockTitle}>
        {componentData.link ? (
          <>
            <Link
              className={styles.title}
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
            {componentData.src && (
              <Link
                to={componentData.link}
                onClick={() =>
                  onHeaderMegaMenuClick({
                    l1,
                    l2: componentData.title,
                    template: templateType,
                    clickUrl2: componentData.link,
                    img2: componentData.src || ""
                  })
                }
              >
                <img
                  className={styles.img}
                  src={componentData.src}
                  alt={componentData.title}
                />
              </Link>
            )}
          </>
        ) : (
          <>
            <div
              className={styles.title}
              onClick={() =>
                onHeaderMegaMenuClick({
                  l1,
                  l2: componentData.title,
                  template: templateType
                })
              }
            >
              {ReactHtmlParser(componentData.title)}
            </div>
            {componentData.src && (
              <div
                className={styles.imgContainer}
                onClick={() =>
                  onHeaderMegaMenuClick({
                    l1,
                    l2: componentData.title,
                    template: templateType,
                    img2: componentData.src || ""
                  })
                }
              >
                <img
                  className={styles.img}
                  src={componentData.src}
                  alt={componentData.title}
                />
              </div>
            )}
          </>
        )}
      </div>
      {data.children && data.children.length > 0 && (
        <Image
          data={data.children}
          templateType={templateType}
          l1={l1}
          l2={componentData.title}
          onHeaderMegaMenuClick={onHeaderMegaMenuClick}
        />
      )}
      <div className={styles.blockCta}>
        {componentData.link ? (
          <Link
            className={styles.cta}
            to={componentData.link}
            onClick={() =>
              onHeaderMegaMenuClick({
                l1,
                l2: componentData.title,
                clickUrl2: componentData.link,
                template: templateType,
                cta: componentData.ctaName
              })
            }
          >
            {ReactHtmlParser(componentData.ctaName)}
          </Link>
        ) : (
          <div
            className={styles.cta}
            onClick={() =>
              onHeaderMegaMenuClick({
                l1,
                l2: componentData.title,
                template: templateType,
                cta: componentData.ctaName
              })
            }
          >
            {ReactHtmlParser(componentData.ctaName)}
          </div>
        )}
      </div>
    </>
  );
};

export default Title;
