import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  location: string;
  onSearchQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  isMobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  location,
  onSearchQueryChange,
  onLocationChange,
  onSearch,
  isMobile = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 mb-3">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={onSearch}
          size="sm"
          className="bg-[#1f058f] hover:bg-[#2a0bc0] w-full"
        >
          Search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-1 max-w-2xl">
      <Input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Input
        type="text"
        placeholder="Location..."
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
    </div>
  );
};
