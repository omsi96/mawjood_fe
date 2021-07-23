import React from "react";
import AppBar from "../AppBar";
import { Box, Button } from "@material-ui/core";
import Tabs from "../Tabs";
const index = () => {
  return (
    <div>
      <Box component="div" p={{ xs: 5, sm: 7, md: 10, l: 15 }}>
        <Tabs />
      </Box>
    </div>
  );
};

export default index;
