import React from "react";
import { Route, Switch } from "react-router";
import Landing from "./components/Landing/landing";
import Listing from "./components/Listing/listing";
import JobDetail from "./components/JobDetail/jobDetail";

const Career: React.FC = () => {
  return (
    <Switch>
      <Route key="landing" exact path="/careers/">
        <Landing />
      </Route>
      <Route key="listing" exact path="/careers/list">
        <Listing />
      </Route>
      <Route key="jobdetail" exact path="/careers/job/:id">
        <JobDetail />
      </Route>
    </Switch>
  );
};

export default Career;
