// export const copyToClipboard = (text: string) => {
//   const textArea = document.createElement("textarea");

//   textArea.style.position = "fixed";
//   textArea.style.top = "0";
//   textArea.style.left = "0";
//   textArea.style.width = "2em";
//   textArea.style.height = "2em";
//   textArea.style.padding = "0";
//   textArea.style.border = "none";
//   textArea.style.outline = "none";
//   textArea.style.boxShadow = "none";
//   textArea.style.background = "transparent";

//   textArea.value = text;
//   document.body.appendChild(textArea);
//   const isIOSDevice = navigator.userAgent.match(/iphone|ipad/i);

//   if (isIOSDevice) {
//     textArea.setSelectionRange(0, text.length);
//   }
//   textArea.select();
//   try {
//     document.execCommand("copy");
//   } catch (err) {
//     console.log("Unable to copy!" + err);
//   }
//   document.body.removeChild(textArea);
// };

export const copyToClipboard = (text: string) => {
  const scrollPosition = window.scrollY;
  const textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  textArea.style.width = "0";
  textArea.style.height = "0";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.background = "transparent";
  textArea.style.opacity = "0";
  textArea.value = text;
  document.body.appendChild(textArea);

  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      textArea.select();
      document.execCommand("copy");
    }
  } catch (err) {
    console.error("Unable to copy: ", err);
  } finally {
    // Clean up and restore scroll position
    document.body.removeChild(textArea);
    window.scrollTo(0, scrollPosition);
  }
};
