import React from "react";
import { Route, Switch } from "react-router";

// Components
import Home from "../components/Home"

const Routes = () => {
  return (
    <Switch>
      <Route exact component={Home} path="/" />
    </Switch>
  );
};

export default Routes;
