import React from "react";
// import {render} from 'react-dom';
import { useSelector } from "react-redux";
// import Modal from '../../components/common/popup/Modal';
import Slider from "react-slick";
import { AppState } from "reducers/typings";
import { NavLink } from "react-router-dom";
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
        <button className="cerise-btn">start adding to registry</button>
      </NavLink>
    </div>
  );

  return (
    <div>
      {mobile ? (
        <div className="size-block ipops centerpage-desktop text-center">
          {/* <div className="cross" onClick={() => {props.close()} }><i
                        className="icon icon_cross"></i></div> */}
          <div className="add-btn">
            <NavLink to="/">
              <button className="cerise-btn">start adding to registry</button>
            </NavLink>
          </div>
          <Slider {...settings} className="">
            <div className="">
              <img
                src="\static\img\ipops\mobile\ipop3.jpg"
                className="img-responsive"
              />
              <div className="c10-L-R txt">
                To add specific products while you browse, click on the ‘Add to
                Register’ icon provided on the right of the product description.
              </div>
            </div>
            <div className="">
              <img
                src="\static\img\ipops\mobile\ipop2.jpg"
                className="img-responsive"
              />
              <div className="c10-L-R txt">
                To manage your Bridal Registry, select ‘Your Profile’ &gt;
                ‘Bridal Registry’ &gt; ‘Manage Registry’ from the menu provided
                in the dropdown.
              </div>
            </div>
            <div className="">
              <img
                src="\static\img\ipops\mobile\ipop4.jpg"
                className="img-responsive"
              />
              <div className="c10-L-R txt">
                To manage your Bridal Registry, select ‘Your Profile’ &gt;
                ‘Bridal Registry’ &gt; ‘Manage Registry’ from the menu provided
                in the dropdown.
              </div>
            </div>
            <div className="">
              <img
                src="\static\img\ipops\mobile\ipop1.jpg"
                className="img-responsive"
              />
              <div className="c10-L-R txt">
                Adjust the quantity of requested products and see the number of
                bought products in your Bridal Registry.
              </div>
            </div>
          </Slider>
        </div>
      ) : (
        <div className="size-block ipops centerpage-desktop text-center">
          {/* <div className="cross" onClick={() => {props.close()} }><i
                        className="icon icon_cross"></i></div> */}
          <Slider {...settings} className="">
            <div className="">
              <img src="\static\img\ipops\ipop3.jpg" />
              <div className="c10-L-R txt">
                Thank you for registering with us! To add desired products to
                your Bridal Registry, click the ‘Quick View’ tab under each
                product and select ‘Add to Registry’.
              </div>
              <DesktopButton />
            </div>
            <div className="">
              <img src="\static\img\ipops\ipop2.jpg" />
              <div className="c10-L-R txt">
                To add specific products while you browse, click on the ‘Add to
                Register’ icon provided on the right of the product description.
              </div>
              <DesktopButton />
            </div>
            <div className="">
              <img src="\static\img\ipops\ipop1.jpg" />
              <div className="c10-L-R txt">
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
