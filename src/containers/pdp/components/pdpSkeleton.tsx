import React from "react";
import Skeleton from "react-loading-skeleton";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const PdpSkeleton: React.FC<{}> = () => {
  const { mobile } = useSelector((state: AppState) => state.device);

  return (
    <div style={{ margin: "10px" }}>
      <Skeleton duration={1} height={30} width={mobile ? 300 : 500} />
      <div>
        <div style={{ margin: "15px" }}>
          <Skeleton
            width={50}
            style={{ margin: `${mobile ? "0px" : "0px 20px"}` }}
          />
          {mobile && <br />}
          <Skeleton
            width={50}
            height={80}
            count={3}
            style={{ marginRight: "4px" }}
          />
        </div>
        <div style={{ margin: "15px" }}>
          <Skeleton
            width={50}
            style={{ margin: `${mobile ? "0px" : "0px 20px"}` }}
          />
          {mobile && <br />}
          <Skeleton width={80} height={50} style={{ marginRight: "4px" }} />
        </div>
        <div style={{ margin: "15px" }}>
          <Skeleton
            width={50}
            style={{ margin: `${mobile ? "0px" : "0px 20px"}` }}
          />
          {mobile && <br />}
          <Skeleton
            width={mobile ? 120 : 300}
            height={50}
            style={{ marginRight: "4px" }}
          />
        </div>
        {mobile ? null : (
          <div style={{ margin: "15px" }}>
            <Skeleton height={50} width={300} style={{ marginRight: "4px" }} />
            <Skeleton height={50} width={100} />
          </div>
        )}
      </div>
      <div style={{ margin: "10px" }}>
        <Skeleton width={mobile ? 220 : 300} />
        <Skeleton width={mobile ? 220 : 400} />
      </div>
      <div style={{ margin: "10px" }}>
        <Skeleton height={30} />
        <Skeleton height={30} />
        <Skeleton height={30} />
        <Skeleton height={30} />
        <Skeleton height={30} />
      </div>
    </div>
  );
};

export default PdpSkeleton;
