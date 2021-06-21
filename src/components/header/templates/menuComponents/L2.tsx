import {
  MenuComponent,
  MenuComponentL2L3Data
} from "components/header/typings";
import LazyImage from "components/LazyImage";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";
import L3 from "./L3";
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
const L2: React.FC<Props> = ({
  data,
  templateType,
  l1,
  onHeaderMegaMenuClick
}) => {
  const componentData = data.componentData as MenuComponentL2L3Data;
  return (
    <>
      <div className={styles.blockL2}>
        {componentData.link ? (
          <>
            <Link
              className={styles.l2}
              to={componentData.link}
              onClick={() =>
                onHeaderMegaMenuClick({
                  l1,
                  l2: componentData.text,
                  clickUrl2: componentData.link,
                  template: templateType
                })
              }
            >
              {ReactHtmlParser(componentData.text)}
            </Link>
            {componentData.src && (
              <Link
                to={componentData.link}
                onClick={() =>
                  onHeaderMegaMenuClick({
                    l1,
                    l2: componentData.text,
                    clickUrl2: componentData.link,
                    template: templateType,
                    img2: componentData.src || ""
                  })
                }
              >
                <LazyImage
                  aspectRatio="1:1"
                  shouldUpdateAspectRatio={true}
                  isVisible={true}
                  alt={componentData.text}
                  containerClassName={styles.img}
                  src={componentData.src}
                />
              </Link>
            )}
          </>
        ) : (
          <>
            <div
              className={styles.l2}
              onClick={() =>
                onHeaderMegaMenuClick({
                  l1,
                  l2: componentData.text,
                  template: templateType
                })
              }
            >
              {ReactHtmlParser(componentData.text)}
            </div>
            {componentData.src && (
              <div
                className={styles.imgContainer}
                onClick={() =>
                  onHeaderMegaMenuClick({
                    l1,
                    l2: componentData.text,
                    template: templateType,
                    img2: componentData.src || ""
                  })
                }
              >
                <LazyImage
                  aspectRatio="1:1"
                  shouldUpdateAspectRatio={true}
                  isVisible={true}
                  alt={componentData.text}
                  containerClassName={styles.img}
                  src={componentData.src}
                />
              </div>
            )}
          </>
        )}
      </div>

      {data.children && data.children.length > 0 && (
        <L3
          data={data.children}
          templateType={templateType}
          l1={l1}
          l2={componentData.text}
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
                l2: componentData.text,
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
                l2: componentData.text,
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

export default L2;
