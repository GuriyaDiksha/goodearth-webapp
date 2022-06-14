export type Data = {
  id: number;
  title: string;
  summary: string;
  loc: string;
  tags: string[];
  dept: string;
};

export type Depts = {
  title: string;
  desc: string;
  count: number;
};

export type Locs = {
  name: string;
  count: number;
};

export type Tags = {
  name: string;
  count: number;
};

export type Facets = {
  depts: Depts[];
  locs: Locs[];
  tags: Tags[];
};

export type JobListData = {
  facets: Facets;
  data: Data[];
};
