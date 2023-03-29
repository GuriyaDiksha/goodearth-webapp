import React from "react";
import cs from "classnames";
import styles from "./style.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
// import { CollectionItem } from "./typing";
import CollectionImageSlider from "../CollectionImageSlider";
import Test from "./../../../images/test.jpg";

const PlpCollectionItem: React.FC = props => {
  return (
    <div className={styles.moreCollectionImg}>
      <img src={Test} alt="collection-img" />
      <div className={styles.textWrp}>
        <p className={styles.tag}>Fine Bone China</p>
        <h3 className={styles.name}>Pomegranate & Roses Dining</h3>
      </div>
    </div>
  );
};

export default PlpCollectionItem;
