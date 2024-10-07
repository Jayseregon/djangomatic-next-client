import React, { useState } from "react";

interface CustomTooltipProps {
  content: string | number | undefined;
  children: React.ReactNode;
}

/**
 * CustomTooltip component to display a tooltip without causing re-renders.
 *
 * @param {CustomTooltipProps} props - The component props.
 * @returns {JSX.Element} The rendered CustomTooltip component.
 */
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  children,
}): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2 z-10 py-0.5 px-3 bg-blue-500 text-white dark:text-black text-sm rounded-full shadow-lg text-nowrap transition-opacity duration-500 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default CustomTooltip;
