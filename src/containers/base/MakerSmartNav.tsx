import React, { useEffect, useRef } from "react";

export default function MakerSmartNav({ id, inline }) {
  if (!id) {
    return <></>;
  }

  const containerRef = useRef(null);
  const elementId = `maker-smartnav${inline ? "-inline" : ""}`;
  const scriptId = `ssr-maker-smartnav${inline ? "-inline" : ""}`;
  const scriptSrc = `https://showside.maker.co/smartnav-v2${
    inline ? "-inline" : ""
  }.js`;

  useEffect(() => {
    if (window.SmartNav && document.getElementById(elementId)) {
      window.SmartNav.init();
      return;
    }

    const scriptRef = document.getElementById(scriptId);
    if (scriptRef) {
      scriptRef.remove();
    }

    if (containerRef.current) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.defer = true;
      script.src = scriptSrc;
      containerRef.current.appendChild(script);
    }
  }, [id, inline]);

  return (
    <div ref={containerRef}>
      <div id={elementId} data-config={id}></div>
      <script src={scriptSrc} defer={true} id={scriptId}></script>
    </div>
  );
}
