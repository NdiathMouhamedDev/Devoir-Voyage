import React, { StrictMode, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Navbar dynamique, responsive et réutilisable avec daisyUI
 * @param {Object} props
 * @param {Array<{label: string, href: string}>} props.links
 * @param {string|React.ReactNode} props.logo
//  * @param {React.ReactNode} [props.button] --- IGNORE ---
 */
export const Navbar = ({ links = [], logo = "Logo",className }) => {
    return (
        <StrictMode>
            <nav className="center">
                <div className="navbarp bg-base-200 fixed shadow-sm z-100">
                    <div className="navbar-start">
                        <a className="btn btn-ghost text-xl">{logo}</a>
                    </div>
                    <div className="navbar-center  lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            {links.map((link) => 
                                <Link to={link.href} aria-current="page" className={`link `+ className} key={`${link.label}-${link.href}`}>{link.label}
                                </Link>
                            )}
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <Link to="/login" aria-current="page" className="btn link m-4 bg-base-300">Connexion</Link>
                        <Link to="/register" aria-current="page" className="btn link m-4 bg-base-300">Inscription</Link>
                        <div className="void"></div>
                    </div>
                </div>
            </nav>
        </StrictMode>
    );
};
export default Navbar;