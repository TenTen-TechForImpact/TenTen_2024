// SearchBar.tsx - 검색 바 컴포넌트

"use client";

import React from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => (
  <div className={styles.searchContainer}>
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      className={styles.searchBar}
    />
  </div>
);

export default SearchBar;
