"use client";

import { useState, useRef, useEffect, type JSX } from "react";
import { Input } from "@heroui/react";

import { SearchIcon } from "@/components/icons";

/**
 * SearchInput component renders a search input field that can be toggled between expanded and collapsed states.
 * It uses a search icon to toggle the input field and handles click events outside the input to collapse it.
 *
 * @param {Object} props - The props for the SearchInput component.
 * @param {boolean} [props.alwaysExpanded=false] - If true, the search input is always expanded.
 * @returns {JSX.Element} The rendered SearchInput component.
 */
export const SearchInput = ({
  alwaysExpanded = false,
}: {
  alwaysExpanded?: boolean;
}): JSX.Element => {
  // Search state
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Expand search input if alwaysExpanded is true (inside toggle menu)
  useEffect(() => {
    if (alwaysExpanded) {
      setIsSearchExpanded(true);
    }
  }, [alwaysExpanded]);

  /**
   * Toggles the search input field between expanded and collapsed states.
   */
  const toggleSearch = () => {
    if (!alwaysExpanded) {
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

  // Close search input when not focused
  useEffect(() => {
    /**
     * Handles click events outside the search input to collapse it.
     *
     * @param {MouseEvent} event - The mouse event.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchInputRef}>
      {isSearchExpanded || alwaysExpanded ? (
        <Input
          aria-label="Search"
          classNames={{
            input:
              "text-sm border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0",
          }}
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
        />
      ) : (
        <SearchIcon
          className="cursor-pointer"
          data-testid="search-trigger"
          onClick={toggleSearch}
        />
      )}
    </div>
  );
};
