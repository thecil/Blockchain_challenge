import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import BalanceOfController from "./web3/BalanceOfController";
const Header: React.FC = () => {
  return (
    <header className="p-2 bg-gray-200 dark:bg-gray-800 flex justify-between items-center">
      <Link className="text-2xl font-bold" href="/">
        My Website
      </Link>
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
        <ThemeToggle />
        <BalanceOfController />
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
