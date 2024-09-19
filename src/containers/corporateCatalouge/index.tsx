import React, { useEffect } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import globalStyles from "styles/global.scss";

const Catalouge: React.FC = () => {
  const catalogueGACall = () => {
    // const userConsent = CookieService.getCookie("consent").split(",");
    // if (userConsent.includes(GA_CALLS)) {
    dataLayer.push({
      event: "catalogue_link_click",
      click_url:
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/GoodEarth_Corporate_Catalogue-2024.pdf"
    });
    // }
  };
  useEffect(() => {
    catalogueGACall();
  }, []);

  return (
    <div className={styles.catalogeLink}>
      <object
        className={styles.pdf}
        data="https://d3qn6cjsz7zlnp.cloudfront.net/media/GoodEarth_Corporate_Catalogue-2024.pdf"
        type="application/pdf"
      />
      <a
        className={cs(
          styles.mobilePdf,
          globalStyles.textCenter,
          globalStyles.aquaHover
        )}
        rel="noopener noreferrer"
        href="https://d3qn6cjsz7zlnp.cloudfront.net/media/GoodEarth_Corporate_Catalogue-2024.pdf"
        target="_blank"
      >
        Download PDF
      </a>
    </div>
  );
};

export default Catalouge;
