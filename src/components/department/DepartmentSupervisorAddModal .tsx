import { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button, Select, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import CustomButton from "../common/CustomButton";
import DepartmentService from "../../services/DepartmentService";
import SupervisorService from "../../services/SupervisorService";
import { debounce } from "lodash";
import { toast } from "../common/Toast";
import type { SupervisorSimple } from "../../types/supervisor";
import type { DepartmentSupervisorRequest } from "../../types/department";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  departmentId: number;
}

const DepartmentSupervisorAddModal = ({
  visible,
  onCancel,
  onSuccess,
  departmentId,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supervisorOptions, setSupervisorOptions] = useState<
    SupervisorSimple[]
  >([]);
  const [supervisorLoading, setSupervisorLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<DepartmentSupervisorRequest>({
    defaultValues: {
      departmentId: departmentId,
      supervisorId: undefined,
    },
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const fetchSupervisors = debounce((search: string) => {
    setSupervisorLoading(true);
    SupervisorService.getAllSupervisors(search)
      .then((data) => setSupervisorOptions(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to load supervisors");
      })
      .finally(() => setSupervisorLoading(false));
  }, 500);

  const handleFormSubmit: SubmitHandler<DepartmentSupervisorRequest> = (
    data
  ) => {
    setIsSubmitting(true);
    DepartmentService.assignSupervisor(data)
      .then(() => {
        toast.success("Supervisor assigned successfully");
        onSuccess();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response?.data?.devMessage || "Failed to assign supervisor"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ModalComponent
      title="Assign Supervisor"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Supervisor Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Select Supervisor
            </label>
            <Controller
              name="supervisorId"
              control={control}
              rules={{ required: "Supervisor is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select a supervisor"
                  loading={supervisorLoading}
                  filterOption={false}
                  onSearch={(value) => fetchSupervisors(value)}
                  onFocus={() => fetchSupervisors("")}
                  onChange={(value) => field.onChange(value)}
                  className="w-full"
                  listHeight={200}
                  virtual
                >
                  {supervisorOptions.map((supervisor) => (
                    <Option key={supervisor.id} value={supervisor.id}>
                      {supervisor.name} ({supervisor.employeeId})
                    </Option>
                  ))}
                </Select>
              )}
            />

            {errors.supervisorId && (
              <span className="text-red-600 text-sm">
                {errors.supervisorId.message}
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
              Assign
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default DepartmentSupervisorAddModal;
