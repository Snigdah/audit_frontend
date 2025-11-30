import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import CustomButton from "../common/CustomButton";
import AuthService from "../../services/AuthService";
import type { RegisterRequest } from "../../types/auth";
import { toast } from "../common/Toast";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface ViewerFormData {
  employeeId: string;
  password: string;
}

const ViewerAddModal = ({ visible, onCancel, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ViewerFormData>({
    defaultValues: {
      employeeId: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const handleFormSubmit: SubmitHandler<ViewerFormData> = (data) => {
    setIsSubmitting(true);

    const payload: RegisterRequest = {
        ...data,
        userName: data.employeeId, // Using employeeId as userName since no name field
        role: "READ_ONLY_USER",
        designation: 0
    };

    AuthService.register(payload)
      .then(() => {
        toast.success("Viewer registered successfully");
        onSuccess();
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.devMessage || "Failed to register viewer"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ModalComponent
      title="Add New Viewer"
      visible={visible}
      handleCancel={onCancel}
      width={500}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="employeeId"
            label="Viewer ID"
            placeholder="Enter viewer ID"
            register={register}
            error={errors.employeeId}
            required
            registerOptions={{ required: "Employee ID is required" }}
          />

          <InputField
            name="password"
            label="Password"
            placeholder="Enter password"
            type="password"
            register={register}
            error={errors.password}
            required
            registerOptions={{ required: "Password is required" }}
          />

          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
            <Button
              className="w-full md:w-auto !bg-white !text-red-600 !border !border-red-500 hover:!bg-red-50 hover:!text-red-700 !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              onClick={onCancel}
              disabled={isSubmitting}
              size="large"
            >
              Cancel
            </Button>

            <CustomButton
              htmlType="submit"
              loading={isSubmitting}
              disabled={!isDirty}
              className="w-full md:w-auto min-w-[100px] !bg-gray-900 hover:!bg-gray-700 !text-white !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              size="large"
            >
              Add
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default ViewerAddModal;