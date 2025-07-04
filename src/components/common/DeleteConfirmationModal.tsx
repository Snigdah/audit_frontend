import { Button, Space } from "antd";
import ModalComponent from "./ModalComponent";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string; // ✅ Default is "Delete", can be changed to "Remove" easily
  cancelText?: string;
  loading?: boolean;
}

const DeleteConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = "Delete", // ✅ Default is still "Delete"
  cancelText = "Cancel",
  loading = false,
}: Props) => {
  return (
    <ModalComponent
      visible={visible}
      title={title}
      handleCancel={onCancel}
      width={500}
    >
      <div className="flex flex-col gap-4">
        <p>{description}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button type="primary" danger onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
};

export default DeleteConfirmationModal;
