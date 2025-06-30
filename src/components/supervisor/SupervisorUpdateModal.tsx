import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Select, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import CustomButton from "../common/CustomButton";
import DesignationService from "../../services/DesignationService";
import SupervisorService from "../../services/SupervisorService";
import type { Designation } from "../../types/designation";
import type { UpdateSupervisorRequest } from "../../types/supervisor";
import { debounce } from "lodash";
import { toast } from "../common/Toast";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  supervisorId: number | null;
}

const SupervisorUpdateModal = ({
  visible,
  onCancel,
  onSuccess,
  supervisorId,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designationOptions, setDesignationOptions] = useState<Designation[]>(
    []
  );
  const [designationLoading, setDesignationLoading] = useState(false);
  const [loadingSupervisor, setLoadingSupervisor] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdateSupervisorRequest>({
    defaultValues: {
      employeeId: "",
      supervisorName: "",
      designationId: undefined,
    },
  });

  useEffect(() => {
    if (visible && supervisorId !== null) {
      fetchSupervisor(supervisorId);
    }
  }, [visible, supervisorId]);

  const fetchSupervisor = async (id: number) => {
    setLoadingSupervisor(true);
    try {
      const supervisor = await SupervisorService.getSupervisorById(id);
      setValue("employeeId", supervisor.employeeId);
      setValue("supervisorName", supervisor.supervisorName);
      setValue("designationId", supervisor.designationId);

      // Preload the designation so it shows as selected option
      setDesignationOptions([
        { id: supervisor.designationId, name: supervisor.designationName },
      ]);
    } catch (error) {
      console.error("Error fetching supervisor:", error);
      message.error("Failed to fetch supervisor details");
      onCancel();
    } finally {
      setLoadingSupervisor(false);
    }
  };

  const fetchDesignations = debounce((search: string) => {
    setDesignationLoading(true);
    DesignationService.getDesignations(search)
      .then((data) => setDesignationOptions(data))
      .catch(() => {
        message.error("Failed to load designations");
      })
      .finally(() => setDesignationLoading(false));
  }, 500);

  const handleFormSubmit = async (data: UpdateSupervisorRequest) => {
    if (supervisorId === null) return;

    setIsSubmitting(true);
    try {
      await SupervisorService.updateSupervisor(supervisorId, data);
      toast.success("Supervisor updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Failed to update supervisor"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible, reset]);

  return (
    <ModalComponent
      title="Update Supervisor"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <Spin spinning={isSubmitting || loadingSupervisor}>
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
            name="supervisorName"
            label="Supervisor Name"
            placeholder="Enter supervisor name"
            register={register}
            error={errors.supervisorName}
            required
            registerOptions={{ required: "Supervisor name is required" }}
          />

          {/* Searchable Dropdown for Designation */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <Controller
              name="designationId"
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
                  value={field.value}
                >
                  {designationOptions.map((d) => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.designationId && (
              <span className="text-red-600 text-sm">
                {errors.designationId.message}
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
              Update
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default SupervisorUpdateModal;
