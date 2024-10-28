import React from "react";
import clsx from "clsx";

interface SkeletonProps {
  size?: "small" | "medium" | "large";
}

export const SkeletonDashboard = ({ size = "medium" }: SkeletonProps) => {
  const cardHeightClasses = {
    small: "h-24",
    medium: "h-32",
    large: "h-40",
  };

  return (
    <div className="flex flex-col space-y-4 animate-pulse">
      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-10">
        {/* Placeholder Cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              "bg-stone-300 w-full rounded-xl",
              cardHeightClasses[size],
            )}
          />
        ))}
      </div>
    </div>
  );
};

export const SkeletonSidebar = ({ size = "medium" }: SkeletonProps) => {
  const itemHeightClasses = {
    small: "h-3",
    medium: "h-4",
    large: "h-5",
  };

  return (
    <div className="flex flex-col space-y-10 mt-10 animate-pulse">
      {/* Sidebar Items */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`bg-stone-300 rounded ${itemHeightClasses[size]} w-${
            (index + 6) * 10
          }%`}
        />
      ))}
    </div>
  );
};
