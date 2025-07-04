import React from "react";

interface SectionHeaderProps {
  title: string;
  rightContent?: React.ReactNode;
  icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  rightContent,
  icon,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 ">
        {icon && (
          <div className="w-10 h-10 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>
      {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
    </div>
  );
};

export default SectionHeader;
