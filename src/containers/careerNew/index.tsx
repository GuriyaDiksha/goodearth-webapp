import React from "react";
import { Route, Switch } from "react-router";
import Landing from "./components/landing";
import Listing from "./components/listing";

const Career: React.FC = () => {
  return (
    <Switch>
      <Route key="landing" path="/">
        <Landing />
      </Route>
      <Route key="listing" path="/list/">
        <Listing />
      </Route>
    </Switch>
  );
};

export default Career;
