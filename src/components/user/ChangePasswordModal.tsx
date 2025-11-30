import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";
import AuthService from "../../services/AuthService";
import { useAuth } from "../../context/AuthContext"; // import your context

interface ChangePasswordForm {
  oldPassword?: string; // optional for admin
  newPassword: string;
  confirmPassword: string;
}

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  employeeId?: string; // optional, for admin mode
}

const ChangePasswordModal = ({ visible, onCancel, onSuccess, employeeId }: Props) => {
  const { authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdminChangingOtherUser = employeeId && authState.role === "ADMIN";

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ChangePasswordForm>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (visible) reset();
  }, [visible, reset]);

  const handleFormSubmit: SubmitHandler<ChangePasswordForm> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    const idToUse = employeeId || localStorage.getItem("employee_id");
    if (!idToUse) {
      toast.error("Something went wrong");
      return;
    }

    setIsSubmitting(true);
    try {
      await AuthService.changePassword({
        employeeId: idToUse,
        oldPassword: isAdminChangingOtherUser ? "" : data.oldPassword,
        newPassword: data.newPassword,
      });
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.devMessage || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalComponent
      title="Change Password"
      visible={visible}
      handleCancel={onCancel}
      width={500}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Show Current Password only for normal users */}
          {!isAdminChangingOtherUser && (
            <InputField
              name="oldPassword"
              label="Current Password"
              placeholder="Enter your current password"
              type="password"
              register={register}
              error={errors.oldPassword}
              required
              registerOptions={{ required: "Current password is required" }}
            />
          )}

          <InputField
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            type="password"
            register={register}
            error={errors.newPassword}
            required
            registerOptions={{
              required: "New password is required",
            }}
          />

          <InputField
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            type="password"
            register={register}
            error={errors.confirmPassword}
            required
            registerOptions={{
              required: "Please confirm your new password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            }}
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
              className="w-full md:w-auto min-w-[100px] !bg-gray-900 hover:!bg-gray-700 !text-white !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              size="large"
            >
              Change Password
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default ChangePasswordModal;
