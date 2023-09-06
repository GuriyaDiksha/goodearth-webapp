export const getDevice = (userAgent: string, maxTouchPoints: number) => {
  const mobile =
    /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    ) || (typeof window != "undefined" ? window.innerWidth < 992 : false);
  const tablet =
    userAgent.match(/iPad|tablet|kindle|playbook|silk/i) !== null ||
    (userAgent.match(/Macintosh|Mac OS|MacIntel|MacPPC|Mac68K/i) &&
      maxTouchPoints &&
      maxTouchPoints > 2) ||
    (userAgent.match(/android/i) !== null &&
      userAgent.match(/Mobile/i) == null);

  const orientation: "landscape" | "portrait" = "portrait";
  return {
    mobile,
    tablet,
    orientation
  };
};
