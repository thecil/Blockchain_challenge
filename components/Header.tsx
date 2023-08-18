"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import BalanceOfController from "./web3/BalanceOfController";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoMenu } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current !== event.target
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="p-2 bg-gray-200 dark:bg-gray-800 flex justify-between items-center">
      <Link className="text-2xl font-bold" href="/">
        Survey Dapp
      </Link>

      {isMobile ? (
        <>
          <button
            ref={menuButtonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 border border-solid hover:border-gray-800 rounded-full bg-gray-200 dark:bg-gray-800 dark:border-gray-200"
          >
            <IoMenu />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-12 right-1 z-10 p-4 w-fit rounded-md divide-y divide-gray-300 dark:divide-gray-600 bg-gray-200 dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none"
            >
              <nav>
                <ul className="flex flex-col">
                  <li>
                    <Link className="hover:text-gray-300" href="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-gray-300" href="/contact">
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="flex flex-col gap-2 p-2">
                <BalanceOfController />
                <ConnectButton />
              </div>
              <div className="flex items-center gap-2 p-2">
                <p>Theme: </p>
                <ThemeToggle />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link className="hover:text-gray-300" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-300" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex space-x-2">
            <BalanceOfController />
            <ConnectButton />
            <ThemeToggle />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
