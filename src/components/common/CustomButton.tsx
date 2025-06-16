import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";

interface CustomButtonProps extends ButtonProps {
  loadingText?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  loading,
  loadingText,
  children,
  className,
  ...rest
}) => {
  return (
    <Button
      type="primary"
      loading={loading}
      className={`!bg-gray-900 hover:!bg-gray-700 !text-white !py-2 !min-h-[36px] !px-4 sm:!px-6 ${
        className ?? ""
      }`}
      {...rest}
    >
      {loading ? loadingText || children : children}
    </Button>
  );
};

export default CustomButton;
