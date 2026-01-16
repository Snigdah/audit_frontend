import { useEffect, useState, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import ModalComponent from "../common/ModalComponent";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";
import DepartmentService from "../../services/DepartmentService";
import SupervisorService from "../../services/SupervisorService";
import type { SupervisorSimple } from "../../types/supervisor";
import type { DepartmentSupervisorRequest } from "../../types/department";
import { ControlledSearchableSelect } from "../common/SearchableSelectField";
import type { SearchableSelectOption } from "../common/SearchableSelectField";

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

  const { handleSubmit, control, reset, formState: { errors, isDirty }, setValue } =
    useForm<DepartmentSupervisorRequest>({
      defaultValues: { departmentId, supervisorId: undefined },
    });

  useEffect(() => {
    if (!visible) reset();
  }, [visible, reset]);

  // Use useMemo to define a debounced fetch function
  const fetchSupervisors = useMemo(() => {
    // The inner function matches the expected type
    const fetcher = async (search: string): Promise<SearchableSelectOption[]> => {
      try {
        const data: SupervisorSimple[] = await SupervisorService.getAllSupervisorsDropdown(search);
        return data.map(sup => ({
          value: sup.id,
          label: `${sup.name} (${sup.employeeId})`,
        }));
      } catch (err) {
        console.error(err);
        return [];
      }
    };

    // Debounced wrapper returns a normal function for TS
    const debounced = (...args: [string]): Promise<SearchableSelectOption[]> =>
      new Promise((resolve) => {
        void fetcher(args[0]).then(resolve);
      });

    return debounced;
  }, []);

  const handleFormSubmit: SubmitHandler<DepartmentSupervisorRequest> = async (data) => {
    setIsSubmitting(true);
    try {
      await DepartmentService.assignSupervisor(data);
      toast.success("Supervisor assigned successfully");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.devMessage || "Failed to assign supervisor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalComponent
      title="Assign Supervisor"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <ControlledSearchableSelect
          name="supervisorId"
          control={control}
          label="Select Supervisor"
          placeholder="Search or select a supervisor..."
          fetchOptions={fetchSupervisors} // ✅ Now type-safe
          debounceMs={300}
          allowClear
          rules={{ required: "Supervisor is required" }}
          className="w-full"
          selectClassName="searchable-select-custom"
          onSelectChange={(value: number | string) => setValue("supervisorId", Number(value))}
          error={errors.supervisorId}
        />

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
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
    </ModalComponent>
  );
};

export default DepartmentSupervisorAddModal;
