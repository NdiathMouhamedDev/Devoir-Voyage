import React, { StrictMode } from "react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo"

/**
 * Navbar dynamique, responsive et réutilisable avec daisyUI
 * @param {Object} props
 * @param {Array<{label: string, href: string}>} props.links
 * @param {string|React.ReactNode} props.logo
 * @param {string} [props.className]
 */
export const Navbar = ({ links = [], className = "" }) => {
  return (
    <StrictMode>
      <nav className="flex justify-center">
        <div className="navbar bg-base-200 rounded-3xl shadow-lg fixed top-4 w-[90vw] z-50">
          {/* Logo */}
          <div className="navbar-start">
            <AppLogo />
          </div>

          {/* Menu desktop */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-2">
              {links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link id={link.label}
                    to={link.href} 
                    className={`btn btn-ghost text-xl ${className}` }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutons d'authentification */}
          <div className="navbar-end gap-2">
            <Link to="/login" className="btn btn-ghost">
              Connexion
            </Link>
            <Link to="/register" className="btn btn-primary">
              Inscription
            </Link>
          </div>

          {/* Menu mobile hamburger */}
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52"
            >
              {links.map((link) => (
                <li key={`mobile-${link.label}-${link.href}`}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </StrictMode>
  );
};

export default Navbar;