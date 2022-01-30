import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition.js';

function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const mobileNav = useRef(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNavOpen || mobileNav.current.contains(target)) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="flex flex-row mr-5 sm:mx-auto items-center">
            <Link to="/" className="pr-4 pt-5 sm:pt-12" aria-label="Homepage">
              <img src={require('../images/NoMA-wtext.svg').default} width="174" alt="Logo" />
            </Link>
          </div>

          <nav className="hidden md:flex md:flex-grow">
            <ul className="flex justify-end flex-grow items-center">
              <li>
                <Link to="#" className="text-white font-bold ml-6">
                  Discord
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white font-bold ml-6">
                  Twitter
                </Link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </header>
  );
}

export default Header;
