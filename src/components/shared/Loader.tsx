import React from "react";

const Loader = () => {
  return (
    <div className="w-8 h-8 animate-spin relative">
      <span className="w-3 h-3 bg-primary rounded-full top-0 left-0 absolute"></span>
      <span className="w-3 h-3 bg-primary rounded-full top-0 right-0 absolute"></span>
      <span className="w-3 h-3 bg-primary rounded-full bottom-0 left-0 absolute"></span>
      <span className="w-3 h-3 bg-primary rounded-full bottom-0 right-0 absolute"></span>
    </div>
  );
};

export default Loader;
