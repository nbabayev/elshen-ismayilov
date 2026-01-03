import React from "react";
import Button from "@/app/components/atoms/Button/Button";
import SearchInput from "@/app/components/molecules/SearchInput/SearchInput";

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
