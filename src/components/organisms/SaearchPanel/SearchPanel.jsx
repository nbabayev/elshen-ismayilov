import React from "react";
import Button from "@/components/atoms/Button/Button";
import SearchInput from "@/components/molecules/SearchInput/SearchInput";

const SearchPanel = () => {
  return (
    <div>
      <div>
        <Button>Umumi</Button>
        <Button>Umumi</Button>
        <Button>Umumi</Button>
        <Button>Umumi</Button>
        <Button>Umumi</Button>
      </div>
      <SearchInput />
    </div>
  );
};

export default SearchPanel;
