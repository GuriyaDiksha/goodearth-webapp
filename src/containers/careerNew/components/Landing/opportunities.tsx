import React, { useEffect, useState } from "react";
import landing from "./landing.scss";
import { clone } from "lodash";
import { Data } from "containers/careerNew/typings";
import cardImage from "../../../../images/careers/CareersPostCard.png";
import { useHistory } from "react-router";
import Loader from "components/Loader";
import bootstrap from "../../../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";

type Props = {
  data: Data[];
  title: string;
};

const Opportunities: React.FC<Props> = ({ data, title }) => {
  const [list, setList] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    setList([...data.slice(0, 8)]);
    setIsLoading(false);
  }, [data]);

  const loadMore = () => {
    const newList = clone(list);
    setList([...newList, ...data.slice(list.length, list.length + 8)]);
  };

  return (
    <>
      <h1 className={landing.heading}>{title}</h1>
      {isLoading && <Loader />}
      <div className={cs(landing.dept_card_wrapper, bootstrap.row)}>
        {list?.map((ele, i) => (
          <div
            className={cs(landing.dept_card, bootstrap.colmd4)}
            key={i}
            onClick={() => history.push(`/careers/list/${ele.dept}`)}
          >
            <div className={landing.dept_card_img_wrp}>
              <img
                src={cardImage}
                className={landing.dept_card_img}
                alt="dept"
              />
            </div>

            <div className={landing.dept_card_content}>
              <p className={landing.dept_card_heading}>{ele?.dept}</p>
              <p className={landing.dept_card_desc}>{ele?.deptDesc}</p>
            </div>
          </div>
        ))}
      </div>

      {data?.length !== list?.length && !isLoading ? (
        <div className={landing.load_more_btn_wrp}>
          <button className={landing.load_more_btn} onClick={() => loadMore()}>
            Load More
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Opportunities;
