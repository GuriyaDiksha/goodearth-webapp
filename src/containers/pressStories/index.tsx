import React, { useState, useEffect } from "react";
import PressStoriesContent from "./pressStoriesContent";
import Content from "./content";
import { PressStory, PressStoriesResponse } from "./typings.js";
import { useHistory } from "react-router";
import PressStoryService from "services/pressStory";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import * as util from "utils/validate";

const PressStories: React.FC = () => {
  const [data, setData] = useState<PressStory[]>([]);
  const [options, setOptions] = useState<DropdownItem[]>([]);

  const updatePressStoriesData = (story: PressStoriesResponse) => {
    const yearOptions: DropdownItem[] = [];
    story.archive.map((item, index) => {
      yearOptions.push({ value: item.toString(), label: item.toString() });
    });
    setData(story.data);
    setOptions(yearOptions);
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const { mobile } = useSelector((state: AppState) => state.device);

  useEffect(() => {
    util.pageViewGTM("PressStories");
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
    PressStoryService.fetchPressStories(dispatch, year).then(res =>
      // updatePressStoriesData(data)
      updatePressStoriesData({
        archive: res.archive,
        data: res.data
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
      data.map((item, i) => {
        if (item.url == id) {
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
          key={parseInt(year)}
          year={parseInt(year)}
          updatePressStoriesData={updatePressStoriesData}
        />
      );
    }
  };

  return <div>{setSelectedSection()}</div>;
};

export default PressStories;
