import {
  MenuComponent,
  MenuComponentImageData,
  MenuComponentL2L3Data
} from "components/header/typings";
import LazyImage from "components/LazyImage";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "reducers/typings";
import styles from "../styles.scss";
import ReactHtmlParser from "react-html-parser";
import { getInnerText, validURL } from "utils/validate";
import cs from "classnames";

type Props = {
  data: MenuComponent;
  templateType: string;
  l1: string;
  l2?: string;
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
const Image: React.FC<Props> = ({
  data,
  templateType,
  l1,
  l2,
  onHeaderMegaMenuClick
}) => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const aspectRatioMapping = {
    L2L3: "1:1",
    IMAGE: "1:1",
    CONTENT: "3:2.5",
    // "VERTICALIMAGE": "3:3.7",
    VERTICALIMAGE: "",
    IMAGEWITHSIDESUBHEADING: "3:2.2",
    TITLEHEADING: "3:2.5"
  };
  const aspectRatio = aspectRatioMapping[templateType];
  const l2Data = data.componentData as MenuComponentL2L3Data;
  return (
    <>
      {data.children?.map((menuComponent, index) => {
        const componentData = menuComponent.componentData as MenuComponentImageData;
        return (
          <div className={styles.featuredMobileContainer} key={index}>
            {" "}
            {componentData.link ? (
              <>
                {componentData.src &&
                  (validURL(componentData.link) ? (
                    <a
                      href={componentData.link}
                      target={componentData.openInNewTab ? "_blank" : ""}
                      onClick={() =>
                        onHeaderMegaMenuClick({
                          l1,
                          l2: l2 || "",
                          l3: componentData.heading,
                          clickUrl3: componentData.link,
                          template: templateType,
                          img3: mobile
                            ? componentData.thumbnailSrc || componentData.src
                            : componentData.src
                        })
                      }
                    >
                      <div className={styles.img}>
                        <LazyImage
                          aspectRatio={mobile ? "1:1" : aspectRatio}
                          shouldUpdateAspectRatio={true}
                          // containerClassName={styles.img}
                          isVisible={true}
                          alt={getInnerText(componentData.heading)}
                          src={
                            mobile
                              ? componentData.thumbnailSrc || componentData.src
                              : componentData.src
                          }
                        />
                      </div>
                    </a>
                  ) : (
                    <Link
                      to={componentData.link}
                      target={componentData.openInNewTab ? "_blank" : ""}
                      onClick={() =>
                        onHeaderMegaMenuClick({
                          l1,
                          l2: l2 || "",
                          l3: componentData.heading,
                          clickUrl3: componentData.link,
                          template: templateType,
                          img3: mobile
                            ? componentData.thumbnailSrc || componentData.src
                            : componentData.src
                        })
                      }
                    >
                      <div className={styles.img}>
                        <LazyImage
                          aspectRatio={mobile ? "1:1" : aspectRatio}
                          shouldUpdateAspectRatio={true}
                          // containerClassName={styles.img}
                          isVisible={true}
                          alt={getInnerText(componentData.heading)}
                          src={
                            mobile
                              ? componentData.thumbnailSrc || componentData.src
                              : componentData.src
                          }
                        />
                      </div>
                    </Link>
                  ))}
                <div className={styles.container}>
                  {/* {validURL(data.componentData.link) ? (
                    <a
                      href={data.componentData.link}
                      target={componentData.openInNewTab ? "_blank" : ""}
                      className={styles.title}
                      onClick={() =>
                        onHeaderMegaMenuClick({
                          l1,
                          l2: l2 || "",
                          l3: "",
                          clickUrl3: data.componentData.link,
                          template: templateType
                        })
                      }
                    >
                      {ReactHtmlParser(l2Data.text)}
                    </a>
                  ) : (
                    <Link
                      to={data.componentData.link}
                      target={componentData.openInNewTab ? "_blank" : ""}
                      className={styles.title}
                      onClick={() =>
                        onHeaderMegaMenuClick({
                          l1,
                          l2: l2 || "",
                          l3: "",
                          clickUrl3: data.componentData.link,
                          template: templateType
                        })
                      }
                    >
                      {ReactHtmlParser(l2Data.text)}
                    </Link>
                  )} */}

                  <div
                    className={cs(
                      styles.blockHeading,
                      styles.blockHeadingImageTemplate
                    )}
                  >
                    {validURL(componentData.link) ? (
                      <a
                        className={styles.heading}
                        href={componentData.link}
                        target={componentData.openInNewTab ? "_blank" : ""}
                        onClick={() =>
                          onHeaderMegaMenuClick({
                            l1,
                            l2: l2 || "",
                            l3: componentData.heading,
                            clickUrl3: componentData.link,
                            template: templateType
                          })
                        }
                      >
                        {ReactHtmlParser(componentData.heading)}
                      </a>
                    ) : (
                      <Link
                        className={styles.heading}
                        to={componentData.link}
                        target={componentData.openInNewTab ? "_blank" : ""}
                        onClick={() =>
                          onHeaderMegaMenuClick({
                            l1,
                            l2: l2 || "",
                            l3: componentData.heading,
                            clickUrl3: componentData.link,
                            template: templateType
                          })
                        }
                      >
                        {ReactHtmlParser(componentData.heading)}
                      </Link>
                    )}
                  </div>
                  {componentData.subHeading &&
                    (validURL(componentData.link) ? (
                      <a
                        className={styles.subheading}
                        href={componentData.link}
                        target={componentData.openInNewTab ? "_blank" : ""}
                        onClick={() =>
                          onHeaderMegaMenuClick({
                            l1,
                            l2: l2 || "",
                            l3: componentData.heading,
                            clickUrl3: componentData.link,
                            template: templateType,
                            subHeading: componentData.subHeading
                          })
                        }
                      >
                        {ReactHtmlParser(componentData.subHeading)}
                      </a>
                    ) : (
                      <Link
                        className={styles.subheading}
                        to={componentData.link}
                        target={componentData.openInNewTab ? "_blank" : ""}
                        onClick={() =>
                          onHeaderMegaMenuClick({
                            l1,
                            l2: l2 || "",
                            l3: componentData.heading,
                            clickUrl3: componentData.link,
                            template: templateType,
                            subHeading: componentData.subHeading
                          })
                        }
                      >
                        {ReactHtmlParser(componentData.subHeading)}
                      </Link>
                    ))}
                </div>
              </>
            ) : (
              <>
                {componentData.src && (
                  <div
                    className={styles.imgContainer}
                    onClick={() =>
                      onHeaderMegaMenuClick({
                        l1,
                        l2: l2 || "",
                        l3: componentData.heading,
                        template: templateType,
                        img3: mobile
                          ? componentData.thumbnailSrc || componentData.src
                          : componentData.src
                      })
                    }
                  >
                    <LazyImage
                      aspectRatio={mobile ? "1:1" : aspectRatio}
                      shouldUpdateAspectRatio={true}
                      containerClassName={styles.img}
                      isVisible={true}
                      alt={getInnerText(componentData.heading)}
                      src={
                        mobile
                          ? componentData.thumbnailSrc || componentData.src
                          : componentData.src
                      }
                    />
                  </div>
                )}
                <div className={styles.container}>
                  <div
                    className={cs(
                      styles.blockHeading,
                      styles.blockHeadingImageTemplate
                    )}
                  >
                    <div
                      className={styles.heading}
                      onClick={() =>
                        onHeaderMegaMenuClick({
                          l1,
                          l2: l2 || "",
                          l3: componentData.heading,
                          template: templateType
                        })
                      }
                    >
                      {ReactHtmlParser(componentData.heading)}
                    </div>
                  </div>
                  {componentData.subHeading && (
                    <div
                      className={styles.subheading}
                      onClick={() =>
                        onHeaderMegaMenuClick({
                          l1,
                          l2: l2 || "",
                          l3: componentData.heading,
                          template: templateType,
                          subHeading: componentData.subHeading
                        })
                      }
                    >
                      {ReactHtmlParser(componentData.subHeading)}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Image;
