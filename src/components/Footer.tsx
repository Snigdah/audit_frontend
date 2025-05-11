import React from "react";
import { FaHeart, FaQuestionCircle } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-2 sm:mb-0 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ERP System. All rights reserved.
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <FaQuestionCircle className="mr-1" />
            <span>Help Center</span>
          </a>
          <div className="text-sm text-gray-500 flex items-center">
            <FaHeart className="text-red-500 mx-1" />
            <span>by Healthcare Pharmaceuticals</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
