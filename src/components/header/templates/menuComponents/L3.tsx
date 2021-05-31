import {
  MenuComponent,
  MenuComponentL2L3Data
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";
import ReactHtmlParser from "react-html-parser";

type Props = {
  data: MenuComponent[];
  templateType: string;
  l1: string;
  l2: string;
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
const L3: React.FC<Props> = ({
  data,
  templateType,
  l1,
  l2,
  onHeaderMegaMenuClick
}) => {
  return (
    <>
      {data.map((menuComponent, index) => {
        const componentData = menuComponent.componentData as MenuComponentL2L3Data;
        return (
          <div key={index} className={styles.block}>
            {" "}
            {componentData.link ? (
              <Link
                className={styles.l3}
                to={componentData.link}
                onClick={() =>
                  onHeaderMegaMenuClick({
                    l1,
                    l2,
                    l3: componentData.text,
                    clickUrl3: componentData.link,
                    template: templateType
                  })
                }
              >
                {ReactHtmlParser(componentData.text)}
              </Link>
            ) : (
              <div
                className={styles.l3}
                onClick={() =>
                  onHeaderMegaMenuClick({
                    l1,
                    l2,
                    l3: componentData.text,
                    template: templateType
                  })
                }
              >
                {ReactHtmlParser(componentData.text)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default L3;
