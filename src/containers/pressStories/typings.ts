export type PressStory = {
  url: string;
  title: string;
  thumbnail: string;
  pubDate: string;
  shortDesc: string;
  longDesc: string;
  attachment: string;
  publication: string;
  logo: string;
};
export type Option = {
  value: number | string;
  label: number | string;
};

export type PressStoriesResponse = {
  archive: number[];
  data: PressStory[];
};
export type PressStoryEnquiryData = {
  email: string;
  publication: string;
  message: string;
};
