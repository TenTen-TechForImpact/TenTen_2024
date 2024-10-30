// SearchBar.tsx - 검색 바 컴포넌트
// 입력한 검색어를 상위 컴포넌트로 전달

"use client";

import React from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => (
  <input
    type="text"
    placeholder={placeholder}
    onChange={(e) => onSearch(e.target.value)}
    className={styles.searchBar}
  />
);

export default SearchBar;
