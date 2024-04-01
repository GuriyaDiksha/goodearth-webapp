import React from "react";
import { Route, Switch } from "react-router";
import cs from "classnames";
import styles from "./styles.scss";
import { AppState } from "reducers/typings";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import RegisteryFAQ from "./components/registeryFAQ";
import regitery_desktopBanner from "../../images/registery/regitery_desktopBanner.png";
import regitery_mobBanner from "../../images/registery/regitery_mobBanner.png";
import gift_icon_white from "../../images/registery/gift_icon_white.svg";
import create from "../../images/registery/create.svg";
import add from "../../images/registery/add.svg";
import share from "../../images/registery/share.svg";
import organize from "../../images/registery/organize.svg";
import RegisterySlider from "./components/registerySlider";
import { useSelector } from "react-redux";
import RegisteryDockcta from "./components/registeryDockCTA";
import { Props } from "./typings";

function ErrorHandler({ error }: any) {
  console.log("errorHandler....");
  return (
    <div role="alert">
      <p>An error occurred:</p>
      <pre>{error?.message}</pre>
    </div>
  );
}
const Registery: React.FC<Props> = ({ mobileFaq }) => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { isLoggedIn, bridalId } = useSelector((state: AppState) => state.user);
  try {
    return (
      <div>
        <Switch>
          <Route key="landing" exact path="/the-good-earth-registry">
            <div className={cs(styles.registeryContainer)}>
              <div className={cs(styles.registeryBanner)}>
                <div className={cs(styles.bannerImg)}>
                  {!mobile ? (
                    <img src={regitery_desktopBanner} width="100%" />
                  ) : (
                    <img src={regitery_mobBanner} width="100%" />
                  )}
                </div>
                <div className={cs(styles.bannerContent)}>
                  <div className={cs(styles.bannerHeading)}>
                    The Good Earth Registry
                  </div>
                  <div className={cs(styles.bannerSubHeading)}>
                    Curate your own happily-ever-after
                  </div>
                </div>
                <div className={cs(styles.giftIcon)}>
                  <img src={gift_icon_white} />
                </div>
              </div>

              <div className={cs(styles.builtRegistery)}>
                <div className={cs(styles.builtHeading)}>
                  Why We Built The Good Earth Registry
                </div>
                <div className={cs(styles.builtContent)}>
                  <p>
                    For us, thoughtfully chosen gifts are at the heart of every
                    celebration… gifts that not only last a lifetime, but are
                    also meaningful and useful. With our universe of handcrafted
                    products – from entertaining essentials to wellness
                    indulgences and sustainable apparel – we constantly
                    endeavour to bring something special to your life, straight
                    from our hearts to your home (and wardrobe).{" "}
                  </p>{" "}
                  <br />
                  <p>
                    And now, to make your special occasions ever more memorable,
                    we bring you The Good Earth Registry, where you can curate
                    your own gifting wishlist with all that you love.
                  </p>
                </div>
                {isLoggedIn ? (
                  bridalId == 0 ? (
                    <div className={cs(styles.registeryButton)}>
                      <a href="/account/bridal">
                        <button className={cs(styles.regBtn)}>
                          CREATE MY REGISTRY
                        </button>
                      </a>
                    </div>
                  ) : (
                    <div className={cs(styles.registeryButton)}>
                      <a href="/account/bridal">
                        <button className={cs(styles.regBtn)}>
                          VIEW MY REGISTRY
                        </button>
                      </a>
                    </div>
                  )
                ) : (
                  ""
                )}
              </div>

              <div className={cs(styles.fourGrid, bootstrap.row)}>
                <div
                  className={cs(
                    styles.grid,
                    bootstrap.colLg6,
                    bootstrap.colMd12
                  )}
                >
                  <div className={cs(styles.grid1, styles.gridBlock)}>
                    <div className={cs(styles.gridIcon)}>
                      <img src={create} />
                    </div>
                    <div className={cs(styles.gridHeading)}>
                      CREATE/MANAGE REGISTRY
                    </div>
                    <div className={cs(styles.gridContent)}>
                      Sign up on our web boutique and build your registry in a
                      few simple steps, or manage an existing registry
                    </div>
                  </div>
                </div>
                <div
                  className={cs(
                    styles.grid,
                    bootstrap.colLg6,
                    bootstrap.colMd12
                  )}
                >
                  <div className={cs(styles.grid2, styles.gridBlock)}>
                    <div className={cs(styles.gridIcon)}>
                      <img src={add} />
                    </div>
                    <div className={cs(styles.gridHeading)}>
                      ADD TO REGISTRY
                    </div>
                    <div className={cs(styles.gridContent)}>
                      Start filling up your registry with your favourite
                      products from the Good Earth universe. Learn More.
                    </div>
                  </div>
                </div>
                <div
                  className={cs(
                    styles.grid,
                    bootstrap.colLg6,
                    bootstrap.colMd12
                  )}
                >
                  <div className={cs(styles.grid3, styles.gridBlock)}>
                    <div className={cs(styles.gridIcon)}>
                      <img src={share} />
                    </div>
                    <div className={cs(styles.gridHeading)}>SHARE REGISTRY</div>
                    <div className={cs(styles.gridContent)}>
                      Send out the registry link/URL generated via whatsapp or
                      email, and make gifting easy for your friends and family.
                    </div>
                  </div>
                </div>
                <div
                  className={cs(
                    styles.grid,
                    bootstrap.colLg6,
                    bootstrap.colMd12
                  )}
                >
                  <div className={cs(styles.grid4, styles.gridBlock)}>
                    <div className={cs(styles.gridIcon)}>
                      <img src={organize} />
                    </div>
                    <div className={cs(styles.gridHeading)}>
                      ORGANIZE REGISTRY
                    </div>
                    <div className={cs(styles.gridContent)}>
                      View purchases or edit existing gifts, and keep your
                      registry updated with everything that you really love.
                    </div>
                  </div>
                </div>
              </div>

              <div className={cs(styles.sliderWrapper)}>
                <h1 className={cs(styles.sliderHeading)}>
                  Good Earth Universe
                </h1>
                <div className={cs(styles.universeSlider)}>
                  <RegisterySlider />
                </div>
              </div>

              <div className="faq">
                <RegisteryFAQ mobile={mobileFaq} />
              </div>

              <div className={cs(styles.needAssistance)}>
                <div className={cs(styles.assistanceHeading)}>
                  NEED ASSISTANCE?
                </div>
                <div className={cs(styles.assistanceContent)}>
                  For any assistance, enquiries or feedback, please reach out to
                  us on: <br />
                  <a href="tel:(+91 9582 999 555)">+91 9582 999 555</a> /{" "}
                  <a href="tel:(+91 9582 999 888)">+91 9582 999 888</a> <br />
                  Monday through Saturday 9:00 am - 5:00 pm IST <br />
                  <a href="mailto:customercare@goodearth.in">
                    customercare@goodearth.in
                  </a>
                </div>
                <div className={cs(styles.assistanceLink)}>
                  <a
                    href="https://www.goodearth.in/customer-assistance/terms-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Good Earth Registry Terms & Conditions
                  </a>
                </div>
              </div>

              <div className={cs(styles.registeryDockDiv)}>
                <RegisteryDockcta />
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    );
  } catch (error) {
    return <ErrorHandler error={error} />;
  }
};

export default Registery;
