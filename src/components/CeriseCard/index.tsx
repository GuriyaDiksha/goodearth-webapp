import React, { memo } from "react";
import { Props } from "./typings";
import ceriseCard from "./../../images/cerisecard.png";

const CeriseCard: React.FC<Props> = memo(() => {
  return (
    <div>
      <img src={ceriseCard} />
    </div>
  );
});

export default CeriseCard;
