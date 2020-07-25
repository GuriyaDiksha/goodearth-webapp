import React, { useState, useEffect } from "react";
import PressStoriesContent from "./pressStoriesContent";
import Content from "./content";
import { PressStory, PressStoriesResponse } from "./typings.js";
import { useHistory } from "react-router";
import PressStoryService from "services/pressStory";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";

const PressStories: React.FC = () => {
  const [data, setData] = useState<PressStory[]>([]);
  const [options, setOptions] = useState<DropdownItem[]>([]);

  const updatePressStoriesData = (data: PressStoriesResponse) => {
    const yearOptions: DropdownItem[] = [];
    data.archive.map((item, index) => {
      yearOptions.push({ value: item.toString(), label: item.toString() });
    });
    setData(data.data);
    setOptions(yearOptions);
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const { mobile } = useSelector((state: AppState) => state.device);

  useEffect(() => {
    let year = "";
    if (history.location.pathname != "/press-stories") {
      year = history.location.pathname
        .replace("/press-stories/", "")
        .split("/")[0];
    }
    if (!year) {
      year = new Date().getFullYear().toString();
      history.push("/press-stories/" + year, {});
    }
    PressStoryService.fetchPressStories(dispatch, year).then(data =>
      // updatePressStoriesData(data)
      updatePressStoriesData({
        archive: data.archive,
        data: [...data.data, ...data.data]
      })
    );
  }, []);

  const readMore = (url: string) => {
    const urlIndex = history.location.pathname
      .replace("/press-stories/", "")
      .split("/")[1];
    if (!urlIndex) {
      history.push(location.pathname + "/" + url, {});
    } else {
      const len = location.pathname.split("/").length;
      const pathArray = location.pathname.split("/");
      pathArray[len - 1] = url;
      history.push(pathArray.join("/"), {});
    }
  };

  const setSelectedSection = () => {
    const year = history.location.pathname
      .replace("/press-stories/", "")
      .split("/")[0];
    const id = history.location.pathname
      .replace("/press-stories/", "")
      .split("/")[1];
    let index = 0;
    if (data.length == 0) return false;
    if (year && id) {
      data.map((data, i) => {
        if (data.url == id) {
          index = i;
        }
      });
      return (
        <Content
          content={data}
          readIndex={index}
          key={id}
          readMore={readMore}
          mobile={mobile}
        />
      );
    } else {
      return (
        <PressStoriesContent
          history={history}
          mobile={mobile}
          readMore={readMore}
          content={data}
          options={options}
          year={parseInt(year)}
          updatePressStoriesData={updatePressStoriesData}
        />
      );
    }
  };

  return <div>{setSelectedSection()}</div>;
};

export default PressStories;
