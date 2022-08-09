import React from "react";
import whatsapp from "./../../images/whatsapp_new.svg";

type Props = {
  link: string;
  className?: string;
};

const Whatsapp: React.FC<Props> = ({ link, className }) => {
  return (
    <a
      target="_blank"
      href={link}
      className={className}
      rel="noopener noreferrer"
    >
      {/* <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
      >
        <path
          fill="#23b180"
          d="M36.9,20A16.9,16.9,0,1,1,20,3.1,16.8,16.8,0,0,1,36.9,20Z"
        />
        <path
          fill="#fff"
          d="M28.5,18.8a8.4,8.4,0,0,0-16.7-.1v.4A8.6,8.6,0,0,0,13,23.3l-1.5,4.5,4.6-1.5a8,8,0,0,0,4.1,1,8.3,8.3,0,0,0,8.3-8.2ZM20.2,26a7.1,7.1,0,0,1-3.9-1.1l-2.7.8.9-2.6a6.3,6.3,0,0,1-1.4-4c0-.3.1-.5.1-.7a7,7,0,0,1,7-6.3,6.9,6.9,0,0,1,6.9,6.4,1.3,1.3,0,0,1,.1.6A7,7,0,0,1,20.2,26Z"
        />
        <path
          fill="#fff"
          d="M24,20.7l-1.4-.6c-.2-.1-.3-.1-.5.1l-.6.8a.5.5,0,0,1-.5,0,5.6,5.6,0,0,1-1.6-1,10.1,10.1,0,0,1-1.2-1.4c-.1-.2,0-.3.1-.4l.3-.4c.1,0,.1,0,.1-.1s.1-.1.1-.2a.3.3,0,0,0,0-.4,11.4,11.4,0,0,0-.6-1.5c-.2-.4-.3-.3-.5-.3h-.4a.6.6,0,0,0-.5.2,2.2,2.2,0,0,0-.7,1.7,1.5,1.5,0,0,0,.1.7,4.3,4.3,0,0,0,.7,1.4,7.7,7.7,0,0,0,3.5,3.1c2.1.8,2.1.5,2.5.5s1.2-.5,1.3-1a2.3,2.3,0,0,0,.2-.9Z"
        />
      </svg> */}
      <img src={whatsapp} alt="whatsapp" />
      <p>Share via Whatsapp</p>
    </a>
  );
};

export default Whatsapp;
