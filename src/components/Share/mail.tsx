import React from "react";

type Props = {
  link: string;
  className?: string;
};

const Mail: React.FC<Props> = ({ link, className }) => {
  return (
    <a
      target="_blank"
      href={link}
      className={className}
      rel="noopener noreferrer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <circle fill="#4189c9" cx="20" cy="20" r="16.9" />
        <path
          fill="#fff"
          d="M27,14.6l-6.9,5.1c-.1.1-.1.1-.2,0L13,14.6a.3.3,0,0,1,.2-.4H26.8A.3.3,0,0,1,27,14.6Z"
        />
        <path
          fill="#fff"
          d="M28.5,25.1c0,.4-.3.6-.7.6H12.2c-.3.1-.6-.2-.7-.5h0V15l2.8,2,5.2,3.9a.7.7,0,0,0,1,0l7.8-5.8h.2v10Z"
        />
      </svg>
    </a>
  );
};

export default Mail;
