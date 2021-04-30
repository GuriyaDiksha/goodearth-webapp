import {
  MenuComponent,
  MenuComponentImageData
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";

type Props = {
  data: MenuComponent[];
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
  return (
    <>
      {data.map((menuComponent, index) => {
        const componentData = menuComponent.componentData as MenuComponentImageData;
        return (
          <div className={styles.featuredMobileContainer} key={index}>
            {" "}
            {componentData.link ? (
              <>
                <Link
                  to={componentData.link}
                  onClick={() =>
                    onHeaderMegaMenuClick({
                      l1,
                      l2: l2 || "",
                      l3: componentData.heading,
                      clickUrl3: componentData.link,
                      template: templateType,
                      img3: componentData.src
                    })
                  }
                >
                  <img className={styles.img} src={componentData.src} />
                </Link>
                <div className={styles.container}>
                  <div className={styles.blockHeading}>
                    <Link
                      className={styles.heading}
                      to={componentData.link}
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
                      {componentData.heading}
                    </Link>
                  </div>
                  {componentData.subHeading && (
                    <Link
                      className={styles.subheading}
                      to={componentData.link}
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
                      {componentData.subHeading}
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  className={styles.imgContainer}
                  onClick={() =>
                    onHeaderMegaMenuClick({
                      l1,
                      l2: l2 || "",
                      l3: componentData.heading,
                      template: templateType,
                      img3: componentData.src
                    })
                  }
                >
                  <img className={styles.img} src={componentData.src} />
                </div>
                <div className={styles.container}>
                  <div className={styles.blockHeading}>
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
                      {componentData.heading}
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
                      {componentData.subHeading}
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
