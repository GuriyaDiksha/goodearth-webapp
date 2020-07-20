import React, { useState, useEffect, useContext } from "react";
import BridalContext from "./context";
import { Context } from "components/Modal/context.ts";
// import { BridalDetailsType } from './typings';
// import Modal from '../../components/common/popup/Modal';
// import InputField from 'components/common/signin/inputField'
// import Config from "components/config"

type Props = {
  // changeScreen: () => void;
  shareUrl: string;
  // bridalDetails: BridalDetailsType;
};

const ShareLink: React.FC<Props> = props => {
  const [txt, setTxt] = useState("copy");

  const copyLink = () => {
    const copyText = document.getElementById("myInput") as HTMLInputElement;
    const isIOSDevice = navigator.userAgent.match(/ipad|iphone/i);
    if (isIOSDevice) {
      copyText.setSelectionRange(0, copyText.value.length);
    } else {
      copyText.select();
    }
    document.execCommand("copy");
    setTxt("copied");
  };
  const { closeModal } = useContext(Context);
  const {
    // setCurrentModule,
    // setCurrentModuleData,
    data
  } = useContext(BridalContext);

  useEffect(() => {
    const whatsappUrl =
      "whatsapp://send?text=As our special day draws near, we wanted to tell you that your presence at our wedding is all we ask. Having you with us will bring us the most joy of all." +
      "%0D%0A%0D%0A" +
      " However, if you are thinking of gifting us something, please use the link below to contribute to our new life together." +
      "%0D%0A%0D%0A" +
      props.shareUrl +
      "%0D%0A%0D%0A" +
      " As our gifting partner, we have registered with Good Earth’s Bridal Registry where you will find products chosen by us to help build this next stage of our lives.";
    const whatsappElement = document.getElementById(
      "whatsappShare"
    ) as HTMLAnchorElement;
    whatsappElement.setAttribute("href", whatsappUrl);

    const mailUrl =
      "mailto:" +
      "?cc=" +
      "&subject=" +
      "Public Link to " +
      data.registrantName +
      " and " +
      data.coRegistrantName +
      "'s Bridal registry" +
      "&body=" +
      "Dear," +
      "%0D%0A%0D%0A" +
      "As our special day draws near, we wanted to tell you that your presence at our wedding is all we ask. Having you with us will bring us the most joy of all." +
      "%0D%0A%0D%0A" +
      "However, if you are thinking of gifting us something, please use the link below to contribute to our new life together." +
      "%0D%0A%0D%0A" +
      props.shareUrl +
      "%0D%0A%0D%0A" +
      "As our gifting partner, we have registered with Good Earth’s Bridal Registry where you will find products chosen by us to help build this next stage of our lives." +
      "%0D%0A%0D%0A" +
      "With love and gratitude,";
    const mailelement = document.getElementById(
      "mailShare"
    ) as HTMLAnchorElement;
    mailelement.setAttribute("href", mailUrl);
  }, []);

  return (
    <div className="size-block-bridal ht centerpage-desktop text-center">
      <div className="cross">
        <i className="icon icon_cross" onClick={closeModal}></i>
      </div>

      <div className="row">
        <div className="col-xs-8 col-xs-offset-2">
          <div className="login-form">
            <div className="section cart">
              <div className="voffset7">
                <h2>Share Registry Link</h2>
              </div>
              <div className="voffset3 share-txt-box">
                <input type="text" value={props.shareUrl} id="myInput" />
                <span className="copylink" onClick={copyLink}>
                  <a>{txt}</a>
                </span>
              </div>

              <div className="voffset3 c10-L-R">OR</div>

              <div className="voffset3">
                <a id="whatsappShare" data-action="share/whatsapp/share">
                  <img src="/static/img/bridal/icons_whatsapp.svg" width="50" />
                </a>
                <a id="mailShare" title="Share by Email">
                  <img src="/static/img/bridal/icons_email.svg" width="50" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLink;
