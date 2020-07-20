export const getPushHeader = (src: string, srcType: string) => {
  return `<${src}>; rel=preload; as=${srcType}`;
};
