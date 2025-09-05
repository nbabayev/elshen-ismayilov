import React from "react";
import { IconButton } from "@mui/material";
import Search from "@mui/icons-material/Search";

const SearchInput = () => {
  return (
    <div>
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <Search />
      </IconButton>
    </div>
  );
};

export default SearchInput;
