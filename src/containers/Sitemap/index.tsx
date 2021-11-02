import React from "react";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import {
  InnerMenuData,
  L2MenuData,
  MegaMenuData,
  MenuComponentImageData,
  MenuComponentL2L3Data,
  MenuComponentTitleData
} from "components/header/typings";

const Sitemap: React.FC = () => {
  const { showTimer } = useSelector((state: AppState) => state.info);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { megaMenuData } = useSelector((state: AppState) => state.header);

  const createInnerMenuData = (megaMenuData: MegaMenuData) => {
    const innerMenuData: InnerMenuData = {
      text: megaMenuData.text,
      url: megaMenuData.url,
      l2MenuData: [],
      templates: []
    };
    megaMenuData.columns.map((column, index) => {
      column.templates.map((template, index) => {
        if (template.publishOnMobile) {
          innerMenuData.templates.push(template);
        } else {
          const l2MenuData: L2MenuData = {
            text: "",
            link: "",
            children: [],
            templateType: template.templateType
          };
          if (
            [
              "IMAGE",
              "CONTENT",
              "VERTICALIMAGE",
              "IMAGEWITHSIDESUBHEADING"
            ].includes(template.templateType)
          ) {
            const componentData = template.templateData
              .componentData as MenuComponentTitleData;
            const children = template.templateData.children;

            const { title, link, ctaName } = componentData;
            l2MenuData.text = title;
            l2MenuData.link = link;
            l2MenuData.ctaName = ctaName || "";
            children &&
              children.length > 0 &&
              children.map((child, index) => {
                const childComponentData = child.componentData as MenuComponentImageData;
                const l3MenuData: L2MenuData = {
                  text: childComponentData.heading,
                  link: childComponentData.link
                };
                l2MenuData.children && l2MenuData.children.push(l3MenuData);
              });
          } else if (["L2L3"].includes(template.templateType)) {
            const componentData = template.templateData
              .componentData as MenuComponentL2L3Data;
            const children = template.templateData.children;

            const { text, link, ctaMobile, viewAllLink } = componentData;
            l2MenuData.text = text;
            l2MenuData.link = link;
            l2MenuData.ctaMobile = ctaMobile;
            l2MenuData.viewAllLink = viewAllLink;
            l2MenuData.hideViewAllOnMobile = template.hideViewAllOnMobile;
            children &&
              children.length > 1 &&
              children.map((child, index) => {
                const childComponentData = child.componentData as MenuComponentL2L3Data;
                const l3MenuData: L2MenuData = {
                  text: childComponentData.text,
                  link: childComponentData.link
                };
                l2MenuData.children && l2MenuData.children.push(l3MenuData);
              });
          } else if (["TITLEHEADING"].includes(template.templateType)) {
            const componentData = template.templateData
              .componentData as MenuComponentTitleData;
            const children = template.templateData.children;
            const { title, link } = componentData;
            l2MenuData.text = title;
            l2MenuData.link = link;
            children &&
              children.length > 1 &&
              children.map((child, index) => {
                const childComponentData = child.componentData as MenuComponentImageData;
                const l3MenuData: L2MenuData = {
                  text: childComponentData.heading,
                  link: childComponentData.link
                };
                l2MenuData.children && l2MenuData.children.push(l3MenuData);
              });
          }
          innerMenuData.l2MenuData.push(l2MenuData);
        }
      });
    });
    return innerMenuData;
  };

  return (
    <div
      className={cs(
        styles.pageBody,
        { [styles.pageBodyTimer]: showTimer },
        bootstrap.containerFluid
      )}
    >
      <div className={styles.careersContent}>
        <img src={mobile ? "" : ""} className={globalStyles.imgResponsive} />
        <div className={styles.careersImageCaption}>
          <h4>Sitemap</h4>
        </div>
      </div>
      <div className={styles.sitemapContainer}>
        {megaMenuData.map((l1, i) => {
          const innerMenuData = createInnerMenuData(l1);
          return (
            <div key={i} className={styles.l1Container}>
              <div className={styles.title}>
                <Link to={l1.url}>{ReactHtmlParser(innerMenuData.text)}</Link>
              </div>
              <div className={styles.l2Container}>
                <div className={styles.l2InnerContainer}>
                  {innerMenuData.l2MenuData.map((l2, j) => {
                    return (
                      <div key={`${i}-${j}`} className={styles.l2Item}>
                        <div className={styles.l2Heading}>
                          <Link to={l2.link}>{ReactHtmlParser(l2.text)}</Link>
                        </div>
                        {l2.children?.map((l3, k) => {
                          return (
                            <div key={k} className={styles.l3}>
                              <Link to={l3.link}>
                                {ReactHtmlParser(l3.text)}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Sitemap;
