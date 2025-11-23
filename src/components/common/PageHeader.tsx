import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
  rightContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs = [],
  rightContent,
}) => {
  return (
    <div className="w-full mb-2 pb-2 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6 py-2 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-[22px] sm:pt-0">
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 sm:h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent leading-tight">
                {title}
              </h1>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
            </div>
          </div>

          <div className="overflow-x-auto max-w-full whitespace-nowrap scrollbar-hide">
            <Breadcrumb
              separator={
                <span className="text-gray-400 dark:text-gray-500">/</span>
              }
              className="text-sm flex space-x-1"
            >
              <Breadcrumb.Item className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                <Link to="/dashboard" className="flex items-center truncate">
                  <HomeOutlined className="mr-1" />
                  <span>Home</span>
                </Link>
              </Breadcrumb.Item>

              {breadcrumbs.map((item, index) => (
                <Breadcrumb.Item
                  key={index}
                  className="truncate max-w-[120px] sm:max-w-none text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  {item.path ? (
                    <Link to={item.path} className="font-medium block truncate">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-600 dark:text-gray-300 block truncate">
                      {item.label}
                    </span>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
        </div>

        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
