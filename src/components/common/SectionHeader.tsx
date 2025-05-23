import React from "react";

interface SectionHeaderProps {
  title: string;
  rightContent?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  rightContent,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {title}
      </h2>
      {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
    </div>
  );
};

export default SectionHeader;
