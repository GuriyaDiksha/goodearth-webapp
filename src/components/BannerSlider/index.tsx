import React from "react";
//import { Link } from "react-router-dom";
import cs from "classnames";
//import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";
import { BannerProps } from "./typings";
import Slider from "react-slick";

const BannerSlider: React.FC<BannerProps> = (props: BannerProps) => {
  const { data, setting, mobile } = props;
  return (
    <div
      className={cs(bootstrapStyles.colMd12, "banner-slider", {
        "bannermobile-slider": mobile
      })}
    >
      <Slider {...setting} className="">
        {data?.map((item: string, i: number) => {
          return (
            <div key={i}>
              <img src={item} className={globalStyles.imgResponsive} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default BannerSlider;
