export type JobListData = {
  facets: {
    depts: {
      title: string;
      desc: string;
      count: number;
    }[];
    locs: {
      name: string;
      count: number;
    }[];
    tags: {
      name: string;
      count: number;
    }[];
  };
  data: {
    id: number;
    title: string;
    summary: string;
    loc: string;
    tags: string[];
    dept: string;
  }[];
};
