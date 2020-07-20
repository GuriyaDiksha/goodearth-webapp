export type Job = {
  locationName: string;
  url: string;
  jobShortDescription: string;
  jobLongDescription: string;
  jobTitle: string;
  jobId: number;
  jobsId: string;
};

export type JobData = {
  [location: string]: Job[];
}[];

export type CareerMode = "list" | "apply" | "applyAll";
