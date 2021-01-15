export const getDevice = (userAgent: string) => {
  const mobile =
    /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    ) || (typeof window != "undefined" ? window.innerWidth < 992 : false);
  const tablet =
    userAgent.match(/iPad|android|tablet|kindle|playbook|silk/i) !== null;

  return {
    mobile,
    tablet
  };
};
