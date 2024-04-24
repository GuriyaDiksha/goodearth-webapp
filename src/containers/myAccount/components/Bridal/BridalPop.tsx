import React from "react";
// import {render} from 'react-dom';
import { useDispatch, useSelector } from "react-redux";
// import Modal from '../../components/common/popup/Modal';
import Slider from "react-slick";
import { AppState } from "reducers/typings";
import { NavLink } from "react-router-dom";
import styles from "./styles.scss";
import iconStyles from "styles/iconFonts.scss";
// import "../../../../styles/myslick.css";
import "./slick.css";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import ipopM3 from "../../../../images/bridal/ipops/mobile/ipopM3.png";
import ipopM4 from "../../../../images/bridal/ipops/mobile/ipopM4.jpg";
import ipopM1 from "../../../../images/bridal/ipops/mobile/ipopM1.jpg";
import ipop3 from "../../../../images/bridal/ipops/ipop3.png";
import ipop2 from "../../../../images/bridal/ipops/ipop2.png";
import ipop1 from "../../../../images/bridal/ipops/ipop1.jpg";
import { updateModal } from "actions/modal";
import Button from "components/Button";

const BridalPop: React.FC = () => {
  const { mobile } = useSelector((state: AppState) => state.device);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    dots: true,
    autoplay: true,
    autoplayspeed: 1000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };

  const dispatch = useDispatch();
  const closeBridalPop = () => {
    dispatch(updateModal(false));
  };

  const DesktopButton = () => (
    <div className="">
      <NavLink to="/" onClick={closeBridalPop}>
        <Button variant="mediumAquaCta300" label="start adding to registry" />
      </NavLink>
    </div>
  );

  return (
    <div>
      {mobile ? (
        <div
          className={cs(
            styles.sizeBlockMobile,
            styles.ipops,
            styles.centerpageDesktopMobile,
            globalStyles.textCenter,
            "bridal-pop"
          )}
        >
          <div className={styles.bridalCross} onClick={closeBridalPop}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.icon,
                styles.iconCross
              )}
            ></i>
          </div>
          <div className={styles.addBtn}>
            <NavLink to="/" onClick={closeBridalPop}>
              <Button
                label="start adding to registry"
                variant="mediumMedCharcoalCta366"
              />
            </NavLink>
          </div>
          <Slider {...settings} className="">
            <div className="">
              <img src={ipopM3} className={globalStyles.imgResponsive} />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To add specific products while you browse, click on the ‘Add to
                Register’ icon provided on the right of the product description.
              </div>
            </div>
            {/* <div className="">
              <img src={ipopM2} className={globalStyles.imgResponsive} />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To manage your Bridal Registry, select ‘Your Profile’ &gt;
                ‘Bridal Registry’ &gt; ‘Manage Registry’ from the menu provided
                in the dropdown.
              </div>
            </div> */}
            <div className="">
              <img src={ipopM4} className={globalStyles.imgResponsive} />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To manage your Bridal Registry, select ‘Your Profile’ &gt;
                ‘Bridal Registry’ &gt; ‘Manage Registry’ from the menu provided
                in the dropdown.
              </div>
            </div>
            <div className="">
              <img src={ipopM1} className={globalStyles.imgResponsive} />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                Adjust the quantity of requested products and see the number of
                bought products in your Bridal Registry.
              </div>
            </div>
          </Slider>
        </div>
      ) : (
        <div
          className={cs(
            styles.sizeBlock,
            styles.ipops,
            globalStyles.marginLrAuto,
            // styles.centerpageDesktop,
            globalStyles.textCenter,
            "bridal-pop"
          )}
        >
          <div className={styles.bridalCross} onClick={closeBridalPop}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.icon,
                styles.iconCross
              )}
            ></i>
          </div>
          <Slider {...settings} className="">
            <div className="">
              <img src={ipop3} className={globalStyles.imgResponsive} />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                Thank you for registering with us! To add desired products to
                your Bridal Registry, click the ‘Quick View’ tab under each
                product and select ‘Add to Registry’.
              </div>
              <DesktopButton />
            </div>
            <div className="">
              <img src={ipop2} className={globalStyles.imgResponsive} />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To add specific products while you browse, click on the ‘Add to
                Register’ icon provided on the right of the product description.
              </div>
              <DesktopButton />
            </div>
            <div className="">
              <img src={ipop1} className={globalStyles.imgResponsive} />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To manage your Bridal Registry, select ‘Your Profile’ &gt;
                ‘Bridal Registry’ &gt; ‘Manage Registry’ from the menu provided
                on the left.
              </div>
              <DesktopButton />
            </div>
          </Slider>
        </div>
      )}
    </div>
  );
};
export default BridalPop;
