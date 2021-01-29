import React, { useEffect } from "react";
// import ImageMap from './image-map'
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import SecondaryHeader from "components/SecondaryHeader";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const DesignJournal: React.FC = () => {
  const { mobile } = useSelector((state: AppState) => state.device);

  const showAnimation = (ele: HTMLElement) => {
    const myElement = ele.getBoundingClientRect();

    if (
      myElement.top > 0 &&
      myElement.top < window.innerHeight &&
      ele.classList.contains(styles.hiddenblock)
    ) {
      ele.classList.remove(styles.hiddenblock);
      ele.classList.add(styles.visibleblock);
    } else if (
      myElement.top < 0 ||
      (myElement.top > window.innerHeight &&
        ele.classList.contains(styles.visibleblock))
    ) {
      ele.classList.remove(styles.visibleblock);
      ele.classList.add(styles.hiddenblock);
    }
  };

  const handleScroll = () => {
    const Ids = [
      "block1",
      "block4",
      "block6",
      "block9a",
      "blocks1",
      "blocks2",
      "blocks3",
      "blocks4",
      "blocks5",
      "blocks6",
      "blocks7",
      "blocks8",
      "blocks9",
      "styles.poskv",
      "blocks-dt",
      "blocks10",
      "blocks11",
      "blocks12",
      "blocks13",
      "blocks14",
      "blocks15",
      "blocks16",
      "blocks17",
      "blocks18",
      "blocks19",
      "blocks20",
      "blocks21"
    ];
    Ids.map(id => {
      const element = document.getElementById(id);
      element && showAnimation(element);
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // ImageMap('img[usemap]');
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* <div className="breadcrumbs-block hidden-xs hidden-sm">
                <div className="bootstrapStyles.row dropdown-header minimumWidth">
                    <div className="bootstrapStyles.colMd7 bootstrapStyles.colMdoffset-1 pdp_breadcrumbs">
                        <span><a href="/stories">Stories</a> &gt; </span>
                        <span><a>Design Journals</a></span>
                    </div>
                </div>
            </div> */}
      {!mobile && (
        <SecondaryHeader>
          <div
            className={cs(
              bootstrapStyles.colMd7,
              bootstrapStyles.offsetMd1,
              styles.header,
              globalStyles.verticalMiddle,
              styles.heading
            )}
          >
            <span>
              <Link to="#">Stories</Link>
              &nbsp;&gt;&nbsp;
            </span>
            <span>Design Journals</span>
          </div>
        </SecondaryHeader>
      )}
      <div
        className={cs(
          bootstrapStyles.row,
          styles.subcHeader,
          styles.subcHeader3,
          styles.containerStartDj
        )}
      >
        <div
          className={cs(
            bootstrapStyles.colMd6,
            bootstrapStyles.offsetMd3,
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            globalStyles.textCenter
          )}
        >
          <h1> Design Journals </h1>
          <p>
            A record of the journey, research and inspirations behind each of
            our collections, our Design Journals offer an enchanting foray into
            our stories, perfect for dreamers, designers and poets, who can use
            the blank pages to jot their own inspirations.{" "}
          </p>
        </div>
      </div>

      <div className={bootstrapStyles.row}>
        <div className={cs(bootstrapStyles.col12, styles.designjournal)}>
          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/9d.jpg`}
              useMap="#one"
              className={styles.imgResponsive}
            />
            <map name="one">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Gandhara Design Journal"
                title="Gandhara Design Journal"
                href="https://www.goodearth.in/designjournalbook/?id=GandharaJournal2019"
                coords="1045,142,1613,945"
                shape="rect"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Pariza Vase"
                title="Pariza Vase"
                href="https://www.goodearth.in/catalogue/pariza-vase-large_14128/"
                coords="2031,554,296"
                shape="circle"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Taxila Collection"
                title="Taxila Collection"
                href="https://www.goodearth.in/collection/living_taxila-2_320/"
                coords="1365,1399,1401,1238,1518,1062,1694,962,1874,930,2101,994,2247,1111,2322,1282,2345,1399"
                shape="poly"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Gandhara Design Journal"
                title="Gandhara Design Journal"
                href="https://www.goodearth.in/designjournalbook/?id=GandharaJournal2019"
                // coords="1045,142,1613,945"
                coords="290,1399,312,1013,401,954,818,1036,1331,1089,1312,1397"
                shape="poly"
              />
            </map>

            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.posNew2,
                  styles.visibleblock
                )}
                id="blocks2"
              >
                <div> Pariza Vase</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/pariza-vase-large_14128/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.posNew6,
                  styles.visibleblock
                )}
                id="blocks22"
              >
                <div> Gandhara Design Journal</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/designjournalbook/?id=GandharaJournal2019"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            <div
              className={cs(
                styles.txtBlock,
                styles.posNew1,
                styles.visibleblock
              )}
              id="block1"
            >
              <p
                className={cs(styles.pdpCollName, {
                  [styles.pdpCollNameMobile]: mobile
                })}
              >
                design collection 2018-19
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.voffset2
                )}
              >
                Gandhara Design Journal
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.italic,
                  globalStyles.voffset2
                )}
              >
                Myth. Memory. Legacy.
              </p>
              {!mobile && (
                <p className={styles.pdpCopyBody}>
                  Illustrating stories of ancient Gandharan civilisation, our
                  inspiration for Design Collection 2018-19{" "}
                </p>
              )}
              <p className={cs(styles.txtLink, globalStyles.voffset3)}>
                <a
                  href="https://www.goodearth.in/designjournalbook/?id=GandharaJournal2019"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  explore inside
                </a>
              </p>
            </div>
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/9c.jpg`}
              useMap="#two"
              className={styles.imgResponsive}
            />
            <map name="two">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Taxila Tea Mug"
                title="Taxila Tea Mug"
                href="https://www.goodearth.in/catalogue/category/living/dining_28/?source=plp&amp;currency=INR&amp;category_shop=Living+%3E+Dining+%3E+Tea+%26+Coffee"
                coords="1175,530,1531,868"
                shape="rect"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Sutra Curve Tray"
                title="Sutra Curve Tray"
                href="https://www.goodearth.in/catalogue/sutra-curve-tray_14361/"
                coords="1071,993,1908,1252"
                shape="rect"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Taxila Collection"
                title="Taxila Collection"
                href="https://www.goodearth.in/collection/living_taxila-2_320/"
                coords="1367,2,1391,185,1467,314,1546,410,1749,501,2042,471,2254,295,2336,64,2332,2"
                shape="poly"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Gandhara Design Journal"
                title="Gandhara Design Journal"
                href="https://www.goodearth.in/designjournalbook/?id=GandharaJournal2019"
                // coords="1045,142,1613,945"
                coords="280,0,240,350,759,414,1295,463,1312,0"
                shape="poly"
              />
            </map>
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.posNew5,
                  styles.visibleblock
                )}
                id="blocks1"
              >
                <div> Taxila Tea Mug</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/category/living/dining_28/?source=plp&currency=INR&category_shop=Living+%3E+Dining+%3E+Tea+%26+Coffee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.posNew3,
                  styles.visibleblock
                )}
                id="blocks17"
              >
                <div> Taxila Collection</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/collection/living_taxila-2_320/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.posNew4,
                  styles.visibleblock
                )}
                id="blocks18"
              >
                <div> Sutra Curve Tray</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/sutra-curve-tray_14361/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/9e.jpg`}
              useMap="#three"
              className={styles.imgResponsive}
            />
            <map name="three">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Shambala Design Journal"
                title="Shambala Design Journal"
                href="https://www.goodearth.in/catalogue/shambala-design-journal_8553/"
                coords="324,153,882,960"
                shape="rect"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Sutra Curve Tray"
                title="Sutra Curve Tray"
                href="https://www.goodearth.in/catalogue/sutra-curve-tray_14361/"
                coords="1902,0,1096,278"
                shape="rect"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Shambala Design Journal"
                title="Shambala Design Journal"
                href="https://www.goodearth.in/catalogue/shambala-design-journal_8553/"
                coords="1026,426,2124,1181"
                shape="rect"
              />
            </map>
            {!mobile && (
              <div
                className={cs(styles.pdtName, styles.pos1, styles.visibleblock)}
                id="blocks19"
              >
                <div> Shambala Design Journal</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/shambala-design-journal_8553/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(styles.pdtName, styles.pos2, styles.visibleblock)}
                id="blocks20"
              >
                <div> Shambala Design Journal</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/shambala-design-journal_8553/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            <div
              className={cs(styles.txtBlock, styles.pos1, styles.visibleblock)}
              id="blocks21"
            >
              <p
                className={cs(styles.pdpCollName, {
                  [styles.pdpCollNameMobile]: mobile
                })}
              >
                design collection 2016-17
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.voffset2
                )}
              >
                shambala design journal
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.italic,
                  globalStyles.voffset2
                )}
              >
                stories & myths of the orient
              </p>
              {!mobile && (
                <p className={styles.pdpCopyBody}>
                  An enchanting journey through the mythical kingdom of
                  Shambala, land of the pure heart, nestled deep in the
                  Himalayas.{" "}
                </p>
              )}
              <p className={cs(styles.txtLink, globalStyles.voffset3)}>
                <a
                  href="https://www.goodearth.in/designjournalbook/?id=ShambalaDesignJournal2017"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  explore inside
                </a>
              </p>
            </div>
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/2.jpg`}
              useMap="#iplate"
              className={styles.imgResponsive}
            />
            <map name="iplate">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Tea & Coffee"
                title="Tea & Coffee"
                href="https://www.goodearth.in/catalogue/shambala-tea-plate-set-of-4_8283/"
                coords="422,2,399,72,443,182,532,267,657,346,848,314,931,229,973,34,943,8"
                shape="poly"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Indechine Collection"
                title="Indechine Collection"
                href="https://www.goodearth.in/collection/living_indechine_223/"
                coords="1303,796,500"
                shape="circle"
              />
            </map>
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.pos3,
                  styles.txtBlock,
                  styles.visibleblock
                )}
                id="blocks3"
              >
                <p className={cs(styles.pdpProdName, globalStyles.voffset2)}>
                  Shambala Tea Plate
                </p>
                <p
                  className={cs(
                    styles.pdpProdName,
                    globalStyles.italic,
                    globalStyles.voffset2
                  )}
                >
                  (Set of 4)
                </p>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/shambala-tea-plate-set-of-4_8283/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(styles.pdtName, styles.pos4, styles.visibleblock)}
                id="blocks4"
              >
                <div> Indechine Collection</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/collection/living_indechine_223/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/3.jpg`}
              useMap="#mug"
              className={styles.imgResponsive}
            />
            <map name="mug">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Mug"
                title="Mug"
                href="https://www.goodearth.in/catalogue/category/living/dining_28/?source=plp&currency=INR&category_shop=Living+%3E+Dining+%3E+Tea+%26+Coffee"
                coords="774,78,748,373,1020,418,1056,354,1117,263,1136,182,1086,138,1062,93"
                shape="poly"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Bowl"
                title="Bowl"
                href="https://www.goodearth.in/catalogue/shambala-bowl_6783/"
                coords="1595,569,412"
                shape="circle"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Samarqand Journal"
                title="Samarqand Journal"
                href="https://www.goodearth.in/catalogue/samarqanddesign-journal_2315/"
                coords="1730,1011,2269,1249"
                shape="rect"
              />
            </map>
            {!mobile && (
              <div
                className={cs(styles.pdtName, styles.pos5, styles.visibleblock)}
                id="blocks5"
              >
                <div> Tea & Coffee</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/category/living/dining_28/?source=plp&currency=INR&category_shop=Living+%3E+Dining+%3E+Tea+%26+Coffee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(styles.pdtName, styles.pos6, styles.visibleblock)}
                id="blocks6"
              >
                <div> Shambala Bowl</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/shambala-bowl_6783/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/4.jpg`}
              useMap="#samarqand"
              className={styles.imgResponsive}
            />
            <map name="samarqand">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Samarqand Journal"
                title="Samarqand Journal"
                href="https://www.goodearth.in/catalogue/samarqanddesign-journal_2315/"
                coords="1734,2,2311,555"
                shape="rect"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Samarqand Design Journal"
                title="Samarqand Design Journal"
                href="https://www.goodearth.in/catalogue/the-story-of-babur_8348/"
                coords="1770,1107,729,280"
                shape="rect"
              />
            </map>
            {!mobile && (
              <div
                className={cs(styles.pdtName, styles.pos7, styles.visibleblock)}
                id="blocks7"
              >
                <div> Samarqand Design Journal</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/samarqanddesign-journal_2315/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(styles.pdtName, styles.pos8, styles.visibleblock)}
                id="blocks8"
              >
                <div> Samarqand Design Journal</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/samarqanddesign-journal_2315"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            <div
              className={cs(styles.txtBlock, styles.pos4, styles.visibleblock)}
              id="block4"
            >
              <p
                className={cs(styles.pdpCollName, {
                  [styles.pdpCollNameMobile]: mobile
                })}
              >
                design collection 2014-15
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.voffset2
                )}
              >
                samarqand design journal
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.italic,
                  globalStyles.voffset2
                )}
              >
                crossroads of the silk route
              </p>
              {!mobile && (
                <p className={styles.pdpCopyBody}>
                  Celebrating the fabled city of Samarqand in the heart of
                  Central Asia, birthplace of Babur, the Founder of the Mughal
                  Empire.{" "}
                </p>
              )}
              <p className={cs(styles.txtLink, globalStyles.voffset3)}>
                <a
                  href="https://www.goodearth.in/catalogue/samarqanddesign-journal_2315/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  explore inside
                </a>
              </p>
            </div>
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/5.jpg`}
              useMap="#candle"
              className={styles.imgResponsive}
            />
            <map name="candle">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Candle"
                title="Candle"
                href="https://www.goodearth.in/catalogue/mia-candle-set-of-2-neroli_8220/"
                coords="1653,170,168"
                shape="circle"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Nishaat Collection"
                title="Nishaat Collection"
                href="https://www.goodearth.in/collection/living_nishaat_6/"
                coords="1123,718,331"
                shape="circle"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Kassel Vase"
                title="Kassel Vase"
                href="https://www.goodearth.in/catalogue/kasselvase_1508/"
                coords="1641,857,1658,946,1599,1054,1527,1145,1471,1187,1463,1228,1484,1240,1550,1223,1633,1136,1730,1092,1855,1232,1997,1245,2351,950,2377,844,2220,636,2027,498,1857,515,1728,589,1635,744"
                shape="poly"
              />
            </map>
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.posKv,
                  styles.visibleblock
                )}
                id="styles.poskv"
              >
                <div>Kassel Vase</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/kasselvase_1508/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}

            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.txtBlock,
                  styles.pos9,
                  styles.visibleblock
                )}
                id="blocks9"
              >
                <p className={cs(styles.pdpProdName, globalStyles.voffset2)}>
                  Mia Candle- Neroli
                </p>
                <p
                  className={cs(
                    styles.pdpProdName,
                    globalStyles.italic,
                    globalStyles.voffset2
                  )}
                >
                  (Set Of 2)
                </p>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/mia-candle-set-of-2-neroli_8220/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.pos10,
                  styles.visibleblock
                )}
                id="blocks9"
              >
                <div> Nishaat Collection</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/collection/living_nishaat_6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/6.jpg`}
              useMap="#votive"
              className={styles.imgResponsive}
            />
            <map name="votive">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Chaand Votive"
                title="Chaand Votive"
                href="https://www.goodearth.in/catalogue/chaand-votive-white-frosted_8205/"
                coords="1092,2,975,208,1043,288,1172,346,1236,341,1367,89,1338,42,1270,4"
                shape="poly"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Ratnakara Journal"
                title="Ratnakara Journal"
                href="https://www.goodearth.in/catalogue/ratnakaradesign-journal_1352/"
                coords="216,248,757,1035"
                shape="rect"
              />
            </map>
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.txtBlock,
                  styles.pos11,
                  styles.visibleblock
                )}
                id="blocks10"
              >
                <p className={cs(styles.pdpProdName, globalStyles.voffset2)}>
                  Chaand Votive
                </p>
                <p
                  className={cs(
                    styles.pdpProdName,
                    globalStyles.italic,
                    globalStyles.voffset2
                  )}
                >
                  (White Frosted)
                </p>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/chaand-votive-white-frosted_8205/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.pos12,
                  styles.visibleblock
                )}
                id="blocks11"
              >
                <div> Ratnakara Journal</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/ratnakaradesign-journal_1352/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
            <div
              className={cs(styles.txtBlock, styles.pos6, styles.visibleblock)}
              id="block6"
            >
              <p
                className={cs(styles.pdpCollName, {
                  [styles.pdpCollNameMobile]: mobile
                })}
              >
                design collection 2013-14
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.voffset2
                )}
              >
                ratnakara design journal
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.italic,
                  globalStyles.voffset2
                )}
              >
                gems of the indian ocean
              </p>
              {!mobile && (
                <p className={styles.pdpCopyBody}>
                  A visual exploration of the lush beauty of the tropical
                  islands in the Indian Ocean, Ratnakara or &#39;The Creator of
                  Gems&#39;.
                </p>
              )}
              <p className={cs(styles.txtLink, globalStyles.voffset3)}>
                <a
                  href="https://www.goodearth.in/catalogue/ratnakaradesign-journal_1352/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  explore inside
                </a>
              </p>
            </div>
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/7.jpg`}
              useMap="#silver"
              className={styles.imgResponsive}
            />
            <map name="silver">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Silver Tray"
                title="Silver Tray"
                href="https://www.goodearth.in/catalogue/tamara-pedestal_8160/"
                coords="935,1250,1119,1082,1365,1033,1577,1084,1747,1203,1792,1250"
                shape="poly"
              />

              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Playing Cards Box"
                title="Playing Cards Box"
                href="https://www.goodearth.in/catalogue/golden-howdahplaying-card-box_3192/"
                coords="1404,567,1929,982"
                shape="rect"
              />
            </map>
            {!mobile && (
              <div
                className={cs(
                  styles.pdtName,
                  styles.pos13,
                  styles.visibleblock
                )}
                id="blocks12"
              >
                <div> Golden Howdah Playing Card Box</div>
                <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
                  <a
                    href="https://www.goodearth.in/catalogue/golden-howdahplaying-card-box_3192/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    explore
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/8.jpg`}
              useMap="#silvertray"
              className={styles.imgResponsive}
            />
            <map name="silvertray">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Silver Tray"
                title="Silver Tray"
                href="https://www.goodearth.in/catalogue/tamara-pedestal_8160/"
                coords="895,28,806,218,823,456,871,634,1081,823,1482,867,1817,670,1919,413,1908,373,1753,360,1344,363,1340,108,1753,98,1775,331,1914,354,1857,38"
                shape="poly"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Glasses"
                title="Glasses"
                href="https://www.goodearth.in/catalogue/sarovar-glasses-set-of-6_8135/"
                coords="1342,109,1760,340"
                shape="rect"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Tamara Pedestal"
                title="Tamara Pedestal"
                href="https://www.goodearth.in/catalogue/darbar-tray_8169/"
                coords="8,704,125,469,157,454,1013,982,1041,1011,884,1242,11,1247"
                shape="poly"
              />
              {!mobile && (
                <div
                  className={cs(
                    styles.pdtName,
                    styles.posDt,
                    styles.visibleblock
                  )}
                  id="blocks-dt"
                >
                  <div> Darbar Tray</div>
                  <div
                    className={cs(globalStyles.c10LR, globalStyles.voffset2)}
                  >
                    <a
                      href="https://www.goodearth.in/catalogue/darbar-tray_8169/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      explore
                    </a>
                  </div>
                </div>
              )}
              {!mobile && (
                <div
                  className={cs(
                    styles.pdtName,
                    styles.pos14,
                    styles.visibleblock
                  )}
                  id="blocks13"
                >
                  <div> Glasses</div>
                  <div
                    className={cs(globalStyles.c10LR, globalStyles.voffset2)}
                  >
                    <a
                      href="https://www.goodearth.in/catalogue/sarovar-glasses-set-of-6_8135/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      explore
                    </a>
                  </div>
                </div>
              )}
              {!mobile && (
                <div
                  className={cs(
                    styles.pdtName,
                    styles.pos15,
                    styles.visibleblock
                  )}
                  id="blocks14"
                >
                  <div> Tamara Pedestal</div>
                  <div
                    className={cs(globalStyles.c10LR, globalStyles.voffset2)}
                  >
                    <a
                      href="https://www.goodearth.in/catalogue/tamara-pedestal_8160/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      explore
                    </a>
                  </div>
                </div>
              )}
            </map>
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/9.jpg`}
              className={styles.imgResponsive}
            />
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/9a.jpg`}
              useMap="#serai"
              className={styles.imgResponsive}
            />
            <map name="serai">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Serai Plate"
                title="Serai Plate"
                href="https://www.goodearth.in/collection/living_serai_60/"
                coords="1264,1246,1270,1184,1293,1133,1329,1091,1302,942,1382,798,1493,741,1635,753,1732,794,1817,927,1800,1069,1747,1163,1758,1241"
                shape="poly"
              />
            </map>

            <div
              className={cs(styles.txtBlock, styles.pos9A, styles.visibleblock)}
              id="block9a"
            >
              <p
                className={cs(styles.pdpCollName, {
                  [styles.pdpCollNameMobile]: mobile
                })}
              >
                design collection 2012-13
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.voffset2
                )}
              >
                farah baksh design journal
              </p>
              <p
                className={cs(
                  styles.pdpProdName,
                  { [styles.pdpProdNameMobile]: mobile },
                  globalStyles.italic,
                  globalStyles.voffset2
                )}
              >
                bestower of delight
              </p>
              {!mobile && (
                <p className={styles.pdpCopyBody}>
                  A record of our inspirations rooted in Kashmir&#39;s
                  breathtaking beauty and rich heritage, its splendid Mughal
                  gardens, lakes and flowers.
                </p>
              )}
            </div>
          </div>

          <div className={globalStyles.relative}>
            <img
              src={`${__CDN_HOST__}/media/designjournal/9b.jpg`}
              useMap="#glasses"
              className={styles.imgResponsive}
            />
            <map name="glasses">
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Serai Plate"
                title="Serai Plate"
                href="https://www.goodearth.in/collection/living_serai_60/"
                coords="1264,4,1287,142,1380,237,1571,278,1728,316,1770,443,1912,547,2186,466,2235,299,2152,87,2012,36,1755,11"
                shape="poly"
              />
              <area
                target="_blank"
                rel="noopener noreferrer"
                alt="Golkonda Glasses"
                title="Golkonda Glasses"
                href="https://www.goodearth.in/catalogue/golkondaglassesset-of-4_289/"
                coords="708,210,816,445,869,490,797,606,804,645,1013,793,1052,799,1149,617,1020,363,863,134,840,119"
                shape="poly"
              />
              {!mobile && (
                <div
                  className={cs(
                    styles.pdtName,
                    styles.txtBlock,
                    styles.pos16,
                    styles.visibleblock
                  )}
                  id="blocks15"
                >
                  <p className={cs(styles.pdpProdName, globalStyles.voffset2)}>
                    Serai Tea Plates
                  </p>
                  <p
                    className={cs(
                      styles.pdpProdName,
                      globalStyles.italic,
                      globalStyles.voffset2
                    )}
                  >
                    (Set of 4)
                  </p>
                  <div
                    className={cs(globalStyles.c10LR, globalStyles.voffset2)}
                  >
                    <a
                      href="https://www.goodearth.in/catalogue/serai-tea-plates-set-of-4_8227/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      explore
                    </a>
                  </div>
                </div>
              )}
              {!mobile && (
                <div
                  className={cs(
                    styles.pdtName,
                    styles.pos17,
                    styles.txtBlock,
                    styles.visibleblock
                  )}
                  id="blocks16"
                >
                  <p className={cs(styles.pdpProdName, globalStyles.voffset2)}>
                    Golkonda Glasses
                  </p>
                  <p
                    className={cs(
                      styles.pdpProdName,
                      globalStyles.italic,
                      globalStyles.voffset2
                    )}
                  >
                    (Set of 4)
                  </p>
                  <div
                    className={cs(globalStyles.c10LR, globalStyles.voffset2)}
                  >
                    <a
                      href="https://www.goodearth.in/catalogue/golkondaglassesset-of-4_289/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      explore
                    </a>
                  </div>
                </div>
              )}
            </map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignJournal;
