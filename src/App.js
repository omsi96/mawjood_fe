import React from "react";
import "./App.css";
import AppBar from "./components/AppBar";
// Routes
import Routes from "./routes";

const App = () => {
  return (
    <div className="wrapper">
      <AppBar />
      <Routes />
    </div>
  );
};

export default App;
