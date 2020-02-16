import React from "react";
import { copyToClipboard } from "utils/clipboard";

type Props = {
  link: string;
  className?: string;
  onClick?: () => void;
};

const CopyLink: React.FC<Props> = ({ link, className, onClick }) => {
  const clickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    copyToClipboard(
      "Here's what I found! It reminded me of you, check it out on Good Earth's web boutique " +
        link
    );
    onClick && onClick();
  };

  return (
    <a target="_blank" className={className} onClick={clickHandler}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path
          fill="#6d6e70"
          d="M12.8,8.8c-1.3-.1-2.2,1.2-2,2.9a3.4,3.4,0,0,0,2.7,2.9c1.3,0,2-1.1,1.8-2.8S14,8.8,12.8,8.8Z"
        />
        <path
          fill="#6d6e70"
          d="M13.3,18c-1.9-.1-3.5,1.2-3.5,2.6A3,3,0,0,0,13,23.2c2.7,0,3.6-1.1,3.6-2.6v-.5c-.2-.8-1.1-1.2-2.1-1.9A2.5,2.5,0,0,0,13.3,18Z"
        />
        <path fill="#6d6e70" d="M16,0A16,16,0,1,0,32,16,16,16,0,0,0,16,0Z" />
        <path
          fill="#fff"
          d="M11.4,24.2a3.6,3.6,0,0,1-3.6-3.6A3.6,3.6,0,0,1,8.9,18L11,15.9a.6.6,0,0,1,.8,0,.5.5,0,0,1,0,.8L9.7,18.8a2.5,2.5,0,0,0,3.5,3.5l3.6-3.6a2.4,2.4,0,0,0,0-3.5h0a.6.6,0,0,1,.1-.8.5.5,0,0,1,.7,0,3.5,3.5,0,0,1,0,5.1L14,23.1A3.6,3.6,0,0,1,11.4,24.2Z"
        />
        <path
          fill="#fff"
          d="M14.8,17.8a.5.5,0,0,1-.4-.2,3.6,3.6,0,0,1,0-5.1h0L18,8.9A3.6,3.6,0,1,1,23.1,14L21,16.1a.5.5,0,0,1-.8-.1.5.5,0,0,1,0-.7l2.1-2.1a2.5,2.5,0,0,0-3.5-3.5l-3.6,3.7a2.3,2.3,0,0,0,0,3.4h0a.6.6,0,0,1,0,.8.4.4,0,0,1-.4.2Z"
        />
      </svg>
    </a>
  );
};

export default CopyLink;
