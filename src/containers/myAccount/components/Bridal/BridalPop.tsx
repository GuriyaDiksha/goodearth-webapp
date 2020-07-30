import React from "react";
// import {render} from 'react-dom';
import { useSelector } from "react-redux";
// import Modal from '../../components/common/popup/Modal';
import Slider from "react-slick";
import { AppState } from "reducers/typings";
import { NavLink } from "react-router-dom";
import styles from "./styles.scss";
// import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
// import * as mapper from "pages/myaccount/mappers/accountm"

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
  const DesktopButton = () => (
    <div className="">
      <NavLink to="/">
        <button className={globalStyles.ceriseBtn}>
          start adding to registry
        </button>
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
            globalStyles.textCenter
          )}
        >
          {/* <div className="cross" onClick={() => {props.close()} }><i
                        className="icon icon_cross"></i></div> */}
          <div className={styles.addBtn}>
            <NavLink to="/">
              <button className={globalStyles.ceriseBtn}>
                start adding to registry
              </button>
            </NavLink>
          </div>
          <Slider {...settings} className="">
            <div className="">
              <img
                src="images\bridal\ipops\mobile\ipop3.jpg"
                className={globalStyles.imgResponsive}
              />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To add specific products while you browse, click on the ‘Add to
                Register’ icon provided on the right of the product description.
              </div>
            </div>
            <div className="">
              <img
                src="images\bridal\ipops\mobile\ipop2.jpg"
                className={globalStyles.imgResponsive}
              />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To manage your Bridal Registry, select ‘Your Profile’ &gt;
                ‘Bridal Registry’ &gt; ‘Manage Registry’ from the menu provided
                in the dropdown.
              </div>
            </div>
            <div className="">
              <img
                src="images\bridal\ipops\mobile\ipop4.jpg"
                className={globalStyles.imgResponsive}
              />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To manage your Bridal Registry, select ‘Your Profile’ &gt;
                ‘Bridal Registry’ &gt; ‘Manage Registry’ from the menu provided
                in the dropdown.
              </div>
            </div>
            <div className="">
              <img
                src="images\bridal\ipops\mobile\ipop1.jpg"
                className={globalStyles.imgResponsive}
              />
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
            styles.centerpageDesktop,
            globalStyles.textCenter
          )}
        >
          {/* <div className="cross" onClick={() => {props.close()} }><i
                        className="icon icon_cross"></i></div> */}
          <Slider {...settings} className="">
            <div className="">
              <img src="\images\bridal\ipops\ipop3.jpg" />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                Thank you for registering with us! To add desired products to
                your Bridal Registry, click the ‘Quick View’ tab under each
                product and select ‘Add to Registry’.
              </div>
              <DesktopButton />
            </div>
            <div className="">
              <img src="\images\bridal\ipops\ipop2.jpg" />
              <div className={cs(globalStyles.c10LR, styles.txt)}>
                To add specific products while you browse, click on the ‘Add to
                Register’ icon provided on the right of the product description.
              </div>
              <DesktopButton />
            </div>
            <div className="">
              <img src="\images\bridal\ipops\ipop1.jpg" />
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
