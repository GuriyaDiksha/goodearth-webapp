import React, { useEffect, useState } from "react";
import landing from "./landing.scss";
import { clone } from "lodash";
import { DeptListData } from "containers/careerNew/typings";
import cardImage from "../../../../images/careers/CareersPostCard.png";
import { useHistory } from "react-router";
import Loader from "components/Loader";
import bootstrap from "../../../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import Button from "components/Button";

type Props = {
  data: DeptListData;
  title: string;
};

const Opportunities: React.FC<Props> = ({ data, title }) => {
  const [list, setList] = useState<DeptListData>([]);
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
  // const uniquedata = (arr: any) => {
  //   const uniqueIds: any[] = [];
  //   const unique = arr.filter((data: any) => {
  //     const isDuplicate = uniqueIds.includes(data.dept);
  //     if (!isDuplicate) {
  //       uniqueIds.push(data.dept);
  //       return true;
  //     }
  //     return false;
  //   });
  //   return unique;
  // };
  // const listdata = uniquedata(list)?.filter((item: any) => {
  //   return item.dept;
  // });
  return (
    <>
      <h1 className={landing.heading}>{title}</h1>
      {isLoading && <Loader />}
      <div className={cs(landing.dept_card_wrapper, bootstrap.row)}>
        {list?.map((ele: any, i: any) => (
          <div
            className={cs(landing.dept_card, bootstrap.colmd4)}
            key={i}
            onClick={() => history.push(`/careers/list?dept=${ele?.title}`)}
          >
            <div className={landing.dept_card_img_wrp}>
              <img
                src={cardImage}
                className={landing.dept_card_img}
                alt="dept"
              />
            </div>

            <div className={landing.dept_card_content}>
              <p className={landing.dept_card_heading}>{ele?.title}</p>
              <p className={landing.dept_card_desc}>{ele?.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {data?.length !== list?.length && !isLoading ? (
        <div className={landing.load_more_btn_wrp}>
          <Button
            variant="outlineSmallMedCharcoalCta"
            className={landing.load_more_btn}
            onClick={() => loadMore()}
            label="Load More"
          />
        </div>
      ) : null}
    </>
  );
};

export default Opportunities;
