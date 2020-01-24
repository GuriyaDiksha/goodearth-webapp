import React from "react";
import styles from "./styles.scss";
import "./slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CollectionDataProps } from "./typings";
import Slider from "react-slick";
import { Settings } from "react-slick";

const CollectionImage: React.FC<CollectionDataProps> = (
  props: CollectionDataProps
) => {
  const { data, setting } = props;
  return (
    <div className={styles.row}>
      <Slider {...(setting as Settings)}>
        {(data.collSliderimage as string[])?.map((image: string, i: number) => {
          return (
            <div>
              <a href={data.url}>
                <img src={image ? image : "/static/img/noimageplp.png"} />
              </a>
            </div>
          );
        })}
      </Slider>
      <div className={styles.imgTxtBlock}>
        <a href={data.url}>
          <p>
            {data.name}&nbsp;
            <span className={styles.italic}>
              {data.categoryName ? data.categoryName[0].name : ""}
              {data.categoryName ? " | " + data.categoryName[1].name : ""}
            </span>
          </p>
          <p className={styles.para}>
            <small>
              {data.shortDescription.length > 140
                ? data.shortDescription.slice(0, 140) + "..."
                : data.shortDescription}
            </small>
          </p>
        </a>
      </div>
    </div>
  );
};

export default CollectionImage;
