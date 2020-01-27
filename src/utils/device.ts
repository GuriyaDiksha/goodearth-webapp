export const getDevice = (userAgent: string) => {
  const mobile = /android|webos|iphone|ipod|ipad|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
  const tablet =
    userAgent.match(/iPad|android|tablet|kindle|playbook|silk/i) !== null;

  return {
    mobile,
    tablet
  };
};
