import React from "react";

const Header = () => (
  <div className="grid grid-flow-col justify-between overflow-hidden ms-[30%] me-[25%]">
    <div className="text-nowrap text-ellipsis text-sm text-primary overflow-hidden w-fit">
      Deficiency
    </div>
    <div className="text-nowrap text-ellipsis text-sm text-primary overflow-hidden w-fit ps-[15%]">
      Checking Procedure
    </div>
    <div className="text-nowrap text-ellipsis text-sm text-primary overflow-hidden w-fit">
      Recommendation
    </div>
  </div>
);

export default Header;
