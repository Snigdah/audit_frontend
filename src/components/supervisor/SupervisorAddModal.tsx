import { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button, Select, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import CustomButton from "../common/CustomButton";
import AuthService from "../../services/AuthService";
import DesignationService from "../../services/DesignationService";
import type { RegisterRequest } from "../../types/auth";
import type { Designation } from "../../types/designation";
import { debounce } from "lodash";
import { toast } from "../common/Toast";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const SupervisorAddModal = ({ visible, onCancel, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designationOptions, setDesignationOptions] = useState<Designation[]>(
    []
  );
  const [designationLoading, setDesignationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<Omit<RegisterRequest, "role">>({
    defaultValues: {
      employeeId: "",
      userName: "",
      password: "",
      designation: undefined,
    },
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const fetchDesignations = debounce((search: string) => {
    setDesignationLoading(true);
    DesignationService.getDesignations(search)
      .then((data) => setDesignationOptions(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to load designations");
      })
      .finally(() => setDesignationLoading(false));
  }, 500);

  const handleFormSubmit: SubmitHandler<Omit<RegisterRequest, "role">> = (
    data
  ) => {
    setIsSubmitting(true);

    const payload: RegisterRequest = {
      ...data,
      role: "SUPERVISOR",
    };

    AuthService.register(payload)
      .then(() => {
        toast.success("Supervisor registered");
        onSuccess();
      })
      .catch((error) => {
        toast.error(error.response?.data?.devMessage || "Failed to register");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ModalComponent
      title="Add New Supervisor"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="employeeId"
            label="Employee ID"
            placeholder="Enter employee ID"
            register={register}
            error={errors.employeeId}
            required
            registerOptions={{ required: "Employee ID is required" }}
          />

          <InputField
            name="userName"
            label="Supervisor Name"
            placeholder="Enter supervisor name"
            register={register}
            error={errors.userName}
            required
            registerOptions={{ required: "Supervisor name is required" }}
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

          {/* Searchable Dropdown for Designation */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <Controller
              name="designation"
              control={control}
              rules={{ required: "Designation is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select a designation"
                  loading={designationLoading}
                  filterOption={false}
                  onSearch={(value) => fetchDesignations(value)}
                  onFocus={() => fetchDesignations("")}
                  onChange={(value) => field.onChange(value)}
                  className="w-full"
                  listHeight={200}
                  virtual
                >
                  {designationOptions.map((d) => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            />

            {errors.designation && (
              <span className="text-red-600 text-sm">
                {errors.designation.message}
              </span>
            )}
          </div>

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

export default SupervisorAddModal;
