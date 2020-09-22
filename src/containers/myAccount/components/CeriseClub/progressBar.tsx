import React from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  percentage: any;
  text: string;
};
function StyledProgressbar(props: Props) {
  return (
    <CircularProgressbarWithChildren
      value={props.percentage}
      text={props.text}
      strokeWidth={5}
      styles={{
        root: {},
        path: {
          stroke: "#ab1e56",
          strokeLinecap: "butt",
          transition: "stroke-dashoffset 0.5s ease 0.5s"
        },
        trail: {
          stroke: "rgb(230, 216, 216)"
        },
        text: {
          fill: "#ab1e56",
          fontSize: "12px"
        }
        // initialAnimation: true
      }}
    />
  );
}
export default StyledProgressbar;
