import { useEffect, useState, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import ModalComponent from "../common/ModalComponent";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";
import { ReportService } from "../../services/ReportService";
import type { OperatorSimple } from "../../types/operator";
import type { AssignReportOperatorRequest } from "../../types/report";
import { ControlledSearchableSelect } from "../common/SearchableSelectField";
import type { SearchableSelectOption } from "../common/SearchableSelectField";
import OperatorService from "../../services/OperatorService";
import { Button } from "antd";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  reportId: number;
}

const ReportOperatorAddModal = ({
  visible,
  onCancel,
  onSuccess,
  reportId,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, control, reset, formState: { errors, isDirty }, setValue } =
    useForm<AssignReportOperatorRequest>({
      defaultValues: { operatorId: undefined },
    });

  useEffect(() => {
    if (!visible) reset();
  }, [visible, reset]);

  // Use useMemo to define a debounced fetch function
  const fetchOperators = useMemo(() => {
    // The inner function matches the expected type
    const fetcher = async (search: string): Promise<SearchableSelectOption[]> => {
      try {
        const data: OperatorSimple[] = await OperatorService.getAllOperatorsDropdown(search);
        return data.map(op => ({
          value: op.id,
          label: `${op.name} (${op.employeeId})`,
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

  const handleFormSubmit: SubmitHandler<AssignReportOperatorRequest> = async (data) => {
    setIsSubmitting(true);
    try {
      await ReportService.assignOperator(reportId, data);
      toast.success("Operator assigned successfully");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.devMessage || "Failed to assign operator");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalComponent
      title="Assign Operator to Report"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <ControlledSearchableSelect
          name="operatorId"
          control={control}
          label="Select Operator"
          placeholder="Search or select an operator..."
          fetchOptions={fetchOperators} // ✅ Now type-safe
          debounceMs={300}
          allowClear
          rules={{ required: "Operator is required" }}
          className="w-full"
          selectClassName="searchable-select-custom"
          onSelectChange={(value: number | string) => setValue("operatorId", Number(value))}
          error={errors.operatorId}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            htmlType="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <CustomButton
            htmlType="submit"
            loading={isSubmitting}
            disabled={!isDirty}
            className="bg-gray-800 hover:bg-gray-700 border-none"
          >
            Assign Operator
          </CustomButton>
        </div>
      </form>
    </ModalComponent>
  );
};

export default ReportOperatorAddModal;