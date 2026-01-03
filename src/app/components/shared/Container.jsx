import React from "react";

const Container = ({ children }) => {
  return (
    <div className="max-w-[1250px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default Container;
