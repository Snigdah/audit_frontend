import { Modal } from "antd";
import { type ReactNode } from "react";

interface Props {
  title?: string;
  visible: boolean;
  centered?: boolean;
  className?: string;
  children: ReactNode;
  width?: number;
  handleCancel?: () => void;
}

const ModalComponent = ({
  title,
  visible,
  children,
  centered = true,
  handleCancel,
  width,
  className,
  ...restProps
}: Props) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      centered={centered}
      width={width || undefined}
      className={
        className || "w-[calc(100%-2rem)] tab-sm:w-[30rem] pc:w-[800px]"
      }
      aria-modal="true"
      {...restProps}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
