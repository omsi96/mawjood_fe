import React from "react";
import { Route, Switch } from "react-router";

// Components
import Home from "../components/Home";
import SubjectsGrid from "../components/SubjectsGrid";
const Routes = () => {
  return (
    <Switch>
      <Route exact component={Home} path="/" />
      <Route exact component={SubjectsGrid} path="/subjects" />
    </Switch>
  );
};

export default Routes;
