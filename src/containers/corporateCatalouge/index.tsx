import React, { useEffect } from "react";
import styles from "./styles.scss";

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
      {/* <object
        className={styles.pdf}
        data="https://d3qn6cjsz7zlnp.cloudfront.net/media/GoodEarth_Corporate_Catalogue-2024.pdf"
        type="application/pdf"
      /> */}
      <iframe
        className={styles.pdf}
        src="https://d3qn6cjsz7zlnp.cloudfront.net/media/GoodEarth_Corporate_Catalogue-2024.pdf&embedded=true"
      >
        <a href="https://d3qn6cjsz7zlnp.cloudfront.net/media/GoodEarth_Corporate_Catalogue-2024.pdf">
          Download PDF
        </a>
      </iframe>
    </div>
  );
};

export default Catalouge;
