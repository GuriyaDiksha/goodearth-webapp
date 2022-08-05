import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import "./slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CollectionDataProps } from "./typings";
import Slider from "react-slick";
import { Settings } from "react-slick";
import "styles/myslick.css";
import LazyImage from "components/LazyImage";
import ReactHtmlParser from "react-html-parser";

const CollectionImage: React.FC<CollectionDataProps> = (
  props: CollectionDataProps
) => {
  const { data, setting } = props;
  const childern = (data.sliderImages as string[])?.map(
    (image: string, i: number) => {
      return (
        <div key={i}>
          <Link to={data.url || "#"}>
            <LazyImage
              aspectRatio="62:93"
              src={image ? image : "/static/img/noimageplp.png"}
              className={styles.imgResponsiveImg}
              alt={data.name}
            />
          </Link>
        </div>
      );
    }
  );
  return (
    <div className={styles.row}>
      <Slider {...(setting as Settings)}>{childern}</Slider>
      <div className={styles.imgTxtBlock}>
        <Link to={data.url || "#"}>
          <p>
            {data.name}&nbsp;
            {data.categoryName && data.categoryName[0]
              ? data.categoryName[0].name
              : ""}
            {data.categoryName && data.categoryName[1]
              ? " | " + data.categoryName[1].name
              : ""}
          </p>
          <p className={styles.para}>
            <small>
              {ReactHtmlParser(
                data.shortDescription.length > 140
                  ? data.shortDescription.slice(0, 140) + "..."
                  : data.shortDescription
              )}
            </small>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CollectionImage;
