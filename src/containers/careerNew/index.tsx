import React from "react";
import { Route, Switch } from "react-router";
import Landing from "./components/Landing/landing";
import Listing from "./components/Listing/listing";

const Career: React.FC = () => {
  return (
    <Switch>
      <Route key="landing" exact path="/careers/">
        <Landing />
      </Route>
      <Route key="listing" exact path="/careers/list/:dept">
        <Listing />
      </Route>
    </Switch>
  );
};

export default Career;
