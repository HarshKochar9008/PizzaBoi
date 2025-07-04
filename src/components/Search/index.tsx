import React from "react";
import debounce from "lodash.debounce";
import styles from "./Search.module.scss";

import searchLogo from "../../assets/img/search-icon.svg";
import closeIcon from "../../assets/img/close-icon.svg";
import { useDispatch } from "react-redux";
import { setSearchValue } from "../../redux/filter/slice";

const Search = () => {
  return (
    <div className={styles.root}>
      <img className={styles.icon} src={searchLogo} alt="search" />
    </div>
  );
};

export default Search;
