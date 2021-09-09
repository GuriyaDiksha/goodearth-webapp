import React, { useEffect, useLayoutEffect, useState } from "react";
import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";
// import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import {
  RouteComponentProps,
  useHistory,
  useLocation,
  withRouter
} from "react-router";
import { AppState } from "reducers/typings";
import { useDispatch, useSelector } from "react-redux";
import LoginService from "services/login";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { showGrowlMessage } from "utils/validate";
import { LOGIN_SUCCESS } from "constants/messages";
// import { Link } from "react-router-dom";
// import INRBanner from "../../images/banner/INRBanner.jpg";
// import USDGBPBanner from "../../images/banner/USDGBPBanner.jpg";
// import INRBannerMobile from "../../images/banner/INRBannerMobile.jpg";
// import USDGBPBannerMobile from "../../images/banner/USDGBPBannerMobile.jpg";

type Props = {
  email: string;
  token: string;
} & RouteComponentProps;

const MakerPage: React.FC<Props> = ({ email, token }) => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    currency,
    info: { showTimer },
    user: { isLoggedIn }
    // device: { mobile }
  } = useSelector((state: AppState) => state);
  const { makerReloadToggle } = useSelector((state: AppState) => state.info);
  useLayoutEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, [currency, isLoggedIn, makerReloadToggle]);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    dataLayer.push(function(this: any) {
      this.reset();
    });
    dataLayer.push({
      event: "HomePageView",
      PageURL: location.pathname,
      PageTitle: "virtual_homePage_view"
    });
  }, []);

  useEffect(() => {
    const noContentContainerElem = document.getElementById(
      "no-content"
    ) as HTMLDivElement;
    if (location.pathname == "/corporate-gifts-catalogue") {
      if (
        noContentContainerElem.classList.contains(globalStyles.contentContainer)
      ) {
        noContentContainerElem.classList.remove(globalStyles.contentContainer);
      }
    } else if (
      !noContentContainerElem.classList.contains(globalStyles.contentContainer)
    ) {
      noContentContainerElem.classList.add(globalStyles.contentContainer);
    }
    // email verification
    const isEmailVerification = location.pathname.includes(
      "/verification/verify-email/"
    );
    if (isEmailVerification) {
      LoginService.verifyEmail(dispatch, email, token)
        .then(res => {
          if (res.status) {
            showGrowlMessage(
              dispatch,
              `${res.firstName}, ${LOGIN_SUCCESS}`,
              5000
            );
          } else {
            dispatch(updateComponent(POPUP.LOGINFORM, res));
            dispatch(updateModal(true));
            history.push("/");
          }
        })
        .catch(err => {
          // do nothing
        });
    }
  }, [location.pathname]);
  // const mobileBannerImagePath =
  //   currency == "INR" ? INRBannerMobile : USDGBPBannerMobile;
  // const desktopBannerImagePath = currency == "INR" ? INRBanner : USDGBPBanner;
  // const bannerUrl =
  //   currency == "INR"
  //     ? "/collection/women_ruh-fiza_457/"
  //     : "/catalogue/category/women/sale-int_271/?source=plp&category_shop=Apparel+%3E+Sale+%3E+50%25";
  return (
    <div className={cs(styles.makerTop, { [styles.makerTopTimer]: showTimer })}>
      {/* <section>
        <div className={cs(bootstrap.row, styles.firstBlock)}>
          <div className={bootstrap.col12}>
            {mobile && (
              <Link to={bannerUrl}>
                <img
                  src={mobileBannerImagePath}
                  className={globalStyles.imgResponsive}
                />
              </Link>
            )}
            {!mobile && (
              <Link to={bannerUrl}>
                <img
                  src={desktopBannerImagePath}
                  className={globalStyles.imgResponsive}
                />
              </Link>
            )}
          </div>
        </div>
      </section> */}
      {mounted && (
        <MakerEnhance
          user="goodearth"
          index="1"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        />
      )}
    </div>
  );
};

export default withRouter(MakerPage);
