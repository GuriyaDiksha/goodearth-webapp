import React, { useEffect, useState } from "react";
import landing from "./landing.scss";
import { clone } from "lodash";
import { Data } from "containers/careerNew/typings";
import cardImage from "../../../../images/careers/CareersPostCard.png";

type Props = {
  data: Data[];
  title: string;
};

const Opportunities: React.FC<Props> = ({ data, title }) => {
  const [list, setList] = useState<Data[]>([]);

  useEffect(() => {
    setList([...data.slice(0, 8)]);
  }, [data]);

  const loadMore = () => {
    const newList = clone(list);
    setList([...newList, ...data.slice(list.length, list.length + 8)]);
  };

  return (
    <>
      <h1 className={landing.heading}>{title}</h1>
      <div className={landing.dept_card_wrapper}>
        {list?.map((ele, i) => (
          <div className={landing.dept_card} key={i}>
            <div className={landing.dept_card_img_wrp}>
              <img
                src={cardImage}
                className={landing.dept_card_img}
                alt="dept"
              />
            </div>

            <div className={landing.dept_card_content}>
              <p className={landing.dept_card_heading}>{ele.dept}</p>
              <p className={landing.dept_card_desc}>{ele.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {data?.length !== list?.length ? (
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
