import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import Breadcrumbs from "./index";

export default { title: "Breadcrumbs" };

export const Breadcrumb = () => {
  const levels = [
    {
      url: "/",
      depth: 0,
      name: "Home"
    },
    {
      url:
        "/catalogue/category/women/uppers_3/?source=plp&currency=INR&category_shop=Apparel+%3E+Womens+Uppers+%3E+Kurtas",
      depth: 2,
      name: "Kurtas"
    },
    {
      url: null,
      depth: 0,
      name: "Mehran Pleated Cotton Kurta"
    }
  ];
  return (
    <div className={styles.row}>
      <Breadcrumbs levels={levels} />
    </div>
  );
};
