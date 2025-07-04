import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/img/logo.png";

import { cartSelector } from "../redux/cart/selectors";
import { selectIsAuthenticated, selectUser } from "../redux/auth/selectors";
import { logout } from "../redux/auth/slice";
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { items, totalPrice } = useSelector(cartSelector);
  const { pathname } = useLocation();
  const isMounted = React.useRef(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const totalCount = items.reduce((sum: number, item: any) => sum + item.count, 0);

  React.useEffect(() => {
    if (isMounted.current) {
      const json = JSON.stringify(items);
      localStorage.setItem("cartItems", json);
    }
    isMounted.current = true;
  }, [items]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logoBlock}>
            <img width="60" height="60" src={logo} className={styles.logo} alt="Pizza logo" />
            <div className={styles.titleBlock}>
              <h1>PIZZABOI</h1>
              <p>Hot slices, cool vibes.</p>
            </div>
          </Link>
          <nav className={styles.mainNav}>
            <Link to="/">Home</Link>
            <Link to="/pizzas">Pizzas</Link>
          </nav>
          <nav className={styles.secondaryNav}>
            <Link to="/orders">Orders</Link>
            <Link to="/history">History</Link>
          </nav>
          <div className={styles.headerRight}>
            {isAuthenticated ? (
              <div className={styles.profileWrapper} ref={profileRef}>
                <div className={styles.profileAvatar} onClick={() => setDropdownOpen((v) => !v)}>
                  <span>{user?.email?.[0]?.toUpperCase() || <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="#eee" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">U</text></svg>}</span>
                </div>
                {dropdownOpen && (
                  <div className={styles.profileDropdown}>
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">Orders</Link>
                    <button onClick={() => { dispatch(logout()); setDropdownOpen(false); }}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to="/login" className={styles.login}>Login</Link>
                <Link to="/register" className={styles.register}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Cart bar below header */}
      {pathname !== "/cart" && (
        <div className={styles.fabCartBar}>
          <Link to="/cart" className={styles.cartBarContent}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>
            <span className={styles.cartBarTotal}>{totalPrice} $</span>
            <span className={styles.cartBarCount}>{totalCount} items</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
