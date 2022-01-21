import React, { useContext, useEffect } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Context } from "components/Modal/context";
import { PopupData } from "typings/api";
import CookieService from "services/cookie";
import HeadingCTA from "./HeadingCTA";
import TwoCTA from "./TwoCTA";
import LeftImage from "./LeftImage";
import TopImage from "./TopImage";
import { useHistory } from "react-router";

const CMSPopup: React.FC<PopupData> = props => {
  const { closeModal } = useContext(Context);
  const history = useHistory();
  useEffect(() => {
    const btn = document.getElementById("info-popup-accept-button");
    btn?.focus();
  }, []);
  const close = (link?: string) => {
    if (link) {
      history.push(link);
    }
    if (props.session) {
      CookieService.setCookie(
        props.pageUrl.split("/").join("_") + "_" + props.heading,
        "show",
        0
      );
    }
    closeModal();
  };
  const elem = new DOMParser().parseFromString(props.content, "text/html").body;
  const target = elem.querySelector('[data-f-id="pbf"]');
  target?.remove();
  const finalContent = elem.innerHTML.toString();
  const mapping = [
    {
      template: "HeadingCTA",
      component: HeadingCTA
    },
    {
      template: "TwoCTA",
      component: TwoCTA
    },
    {
      template: "LeftImage",
      component: LeftImage
    },
    {
      template: "TopImage",
      component: TopImage
    }
  ];
  const Component = mapping.filter(comp => comp.template == props.template)?.[0]
    .component;
  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktop,
          styles.centerpageMobile,
          globalStyles.textCenter
        )}
      >
        <Component finalContent={finalContent} close={close} {...props} />
      </div>
    </div>
  );
};

export default CMSPopup;
