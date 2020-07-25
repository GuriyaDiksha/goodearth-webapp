import React, { useEffect } from "react";
import ReadNext from "./readNext";
import { NavLink } from "react-router-dom";
import { PressStory } from "./typings";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import cs from "classnames";
import SecondaryHeader from "components/SecondaryHeader";
import iconPdf from "../../images/iconsPdf.svg";

type Props = {
  content: PressStory[];
  readIndex: number;
  readMore: (url: string) => void;
  mobile: boolean;
};

const Content: React.FC<Props> = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const publication = "/ " + props.content[props.readIndex].publication;
  const d = new Date(props.content[props.readIndex].pubDate);
  const n = d.getFullYear();
  const redirect = "/press-stories/" + n;
  return (
    <div>
      <div className={cs(bootstrapStyles.row, styles.pressinternal)}>
        <SecondaryHeader>
          <div
            className={cs(
              bootstrapStyles.colMd12,
              bootstrapStyles.offsetMd1,
              styles.header,
              globalStyles.verticalMiddle,
              { [styles.backPressstory]: !props.mobile },
              { [styles.backPressstoryMobile]: props.mobile }
            )}
          >
            <div>
              <span>
                <NavLink to={redirect}>BACK TO PRESS</NavLink>
              </span>
            </div>
          </div>
        </SecondaryHeader>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <div className={styles.date}>
            {props.content[props.readIndex].pubDate}{" "}
            <span className={styles.light}>
              {" "}
              {props.content[props.readIndex].publication
                ? publication
                : ""}{" "}
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.heading}>
              {props.content[props.readIndex].title}
            </div>
            <div className={cs(bootstrapStyles.col12, styles.firstPara)}>
              {props.content[props.readIndex].shortDesc}
            </div>
            <div
              className={cs(bootstrapStyles.col12, styles.contentImg)}
              dangerouslySetInnerHTML={{
                __html: props.content[props.readIndex].longDesc
              }}
            />
            <br />
            <br />
            <div
              className={cs(
                bootstrapStyles.col12,
                globalStyles.textCenter,
                styles.pdflink
              )}
            >
              <a
                href={props.content[props.readIndex].attachment}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={iconPdf} width="10%" />
                <br /> DOWNLOAD PDF
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col12,
            { [styles.press]: !props.mobile },
            { [styles.pressMobile]: props.mobile }
          )}
        >
          {props.content.length > props.readIndex + 1 ? (
            <div
              className={cs(
                bootstrapStyles.col12,
                globalStyles.textCenter,
                styles.nextread
              )}
            >
              <a>next read</a>
            </div>
          ) : (
            ""
          )}
          {props.content.length > +props.readIndex + 1 ? (
            <ReadNext
              mobile={props.mobile}
              content={props.content[props.readIndex + 1]}
              readMore={() =>
                props.readMore(props.content[props.readIndex + 1].url)
              }
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
