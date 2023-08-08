import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="flex bg-gray-200 dark:bg-gray-800 p-4 justify-between">
        <div className="flex space-x-2">
          <p className="font-bold">TECH CHALLENGE</p>
          <p className="text-center">
            Full Stack Developer Rather Labs - thecil
          </p>
        </div>
        <div>
          github repo here
        </div>
      </footer>
    </>
  );
};

export default Footer;
