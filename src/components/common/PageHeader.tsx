import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import React from "react";

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
    <div className="w-full mb-8 pb-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-[27px] sm:pt-0">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white leading-tight">
            {title}
          </h1>
          <Breadcrumb
            separator={
              <span className="text-gray-400 dark:text-gray-500">/</span>
            }
            className="text-sm"
          >
            <Breadcrumb.Item
              href="/"
              className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <HomeOutlined className="mr-1" />
              <span>Home</span>
            </Breadcrumb.Item>
            {breadcrumbs.map((item, index) => (
              <Breadcrumb.Item
                key={index}
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {item.path ? (
                  <a href={item.path} className="font-medium">
                    {item.label}
                  </a>
                ) : (
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>

        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
