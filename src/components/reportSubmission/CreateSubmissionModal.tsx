import React, { useEffect, useRef, useState } from "react";
import { Modal, Spin, Button } from "antd";
import { X } from "lucide-react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import type Handsontable from "handsontable";
import "handsontable/dist/handsontable.min.css";
import { ReportSubmissionService } from "../../services/ReportSubmissionService";
import type {
  CellChangeRequest,
  MergeCellDto,
  TemplateStructureRequest,
} from "../../types/reportSubmission";
import { toast } from "../common/Toast";
import CustomButton from "../common/CustomButton";
import { useAuth } from "../../context/AuthContext";

registerAllModules();

const DEFAULT_STRUCTURE: TemplateStructureRequest = {
  data: [
    ["Field", "Value", "Notes"],
    ["", "", ""],
  ],
  permissions: [
    [["admin", "supervisor", "operator"], ["admin", "supervisor", "operator"], ["admin", "supervisor", "operator"]],
    [["admin", "supervisor", "operator"], ["admin", "supervisor", "operator"], ["admin", "supervisor", "operator"]],
  ],
  mergeCells: [],
};

interface CreateSubmissionModalProps {
  reportId: number;
  expectedSubmissionId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSubmissionModal: React.FC<CreateSubmissionModalProps> = ({
  reportId,
  expectedSubmissionId,
  open,
  onClose,
  onSuccess,
}) => {
  const { authState } = useAuth();
  const hotRef = useRef<{ hotInstance: Handsontable } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [structure, setStructure] = useState<TemplateStructureRequest | null>(null);
  const [versionId, setVersionId] = useState(1);
  const [structureError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStructure(null);
    setLoading(true);
    (async () => {
      try {
        const list = await ReportSubmissionService.fetchByExpectedSubmission(
          expectedSubmissionId,
          { page: 0, size: 1 }
        );
        const first = list?.content?.[0];
        if (first) {
          const detail = await ReportSubmissionService.getSubmissionDetail(
            expectedSubmissionId,
            first.submissionId
          );
          if (detail?.data?.length) {
            setStructure({
              data: detail.data,
              permissions: detail.permissions ?? detail.data.map((row: any[]) => row.map(() => ["admin", "supervisor", "operator"])),
              mergeCells: detail.mergeCells,
            });
            if (detail.versionId != null) setVersionId(detail.versionId);
          } else {
            setStructure(DEFAULT_STRUCTURE);
          }
        } else {
          setStructure(DEFAULT_STRUCTURE);
        }
      } catch {
        setStructure(DEFAULT_STRUCTURE);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, expectedSubmissionId]);

  const hasOperatorPermission = (row: number, col: number): boolean => {
    if (!structure?.permissions?.[row]?.[col]) return false;
    return structure.permissions[row][col].includes("operator");
  };

  const hasExistingValue = (row: number, col: number): boolean => {
    if (!structure?.data?.[row]?.[col]) return false;
    const v = structure.data[row][col];
    return v !== "" && v != null && String(v).trim() !== "";
  };

  const handleSubmit = async () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !structure) return;
    setSubmitting(true);
    try {
      const currentData = hot.getData() as any[][];
      const changes: CellChangeRequest[] = [];
      const now = new Date().toISOString();
      const changedBy = authState.employeeId ?? "operator";
      for (let r = 0; r < currentData.length; r++) {
        for (let c = 0; c < (currentData[r]?.length ?? 0); c++) {
          const oldVal = structure.data[r]?.[c];
          const newVal = currentData[r]?.[c];
          if (oldVal !== newVal && hasOperatorPermission(r, c)) {
            const cellAddress = `${String.fromCharCode(65 + c)}${r + 1}`;
            changes.push({
              rowIndex: r,
              colIndex: c,
              cellAddress,
              oldValue: oldVal,
              newValue: newVal,
              changedBy,
              changedAt: now,
            });
          }
        }
      }
      const mergePlugin = hot.getPlugin("mergeCells");
      const mergeCells: MergeCellDto[] =
        (mergePlugin as any)?.mergedCellsCollection?.mergedCells?.map(
          (mc: { row: number; col: number; rowspan: number; colspan: number }) => ({
            row: mc.row,
            col: mc.col,
            rowspan: mc.rowspan,
            colspan: mc.colspan,
          })
        ) ?? structure.mergeCells ?? [];
      const newPermissions = currentData.map((row, rowIdx) =>
        row.map((_, colIdx) => structure.permissions[rowIdx]?.[colIdx] ?? ["admin", "supervisor", "operator"])
      );
      await ReportSubmissionService.createSubmission(
        reportId,
        versionId,
        expectedSubmissionId,
        {
          templateStructure: {
            data: currentData,
            permissions: newPermissions,
            mergeCells,
          },
          changes,
        }
      );
      toast.success("Submission created");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.devMessage ?? "Failed to create submission");
    } finally {
      setSubmitting(false);
    }
  };

  const hotSettings = structure
    ? {
        data: structure.data,
        colHeaders: true,
        rowHeaders: true,
        height: 400,
        width: "100%",
        licenseKey: "non-commercial-and-evaluation",
        contextMenu: false,
        manualRowResize: true,
        manualColumnResize: true,
        mergeCells: structure.mergeCells,
        stretchH: "all" as const,
        cells: (row: number, col: number) => {
          const readOnly =
            hasExistingValue(row, col) || !hasOperatorPermission(row, col);
          return { readOnly };
        },
      }
    : null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 900 }}
      closeIcon={<X size={20} />}
      maskClosable={!submitting}
      closable={!submitting}
      title={
        <span className="text-lg font-semibold text-gray-800">
          Create submission
        </span>
      }
    >
      <div className="p-2">
        <p className="text-sm text-gray-600 mb-4">
          Fill only empty cells. Existing values are read-only.
        </p>
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Spin tip="Loading template…" />
          </div>
        ) : structureError ? (
          <div className="min-h-[200px] flex items-center justify-center text-gray-500">
            {structureError}
          </div>
        ) : hotSettings ? (
          <>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <HotTable ref={hotRef} settings={hotSettings} />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <Button onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <CustomButton
                onClick={handleSubmit}
                loading={submitting}
                disabled={submitting}
                className="bg-gray-800 hover:bg-gray-700 border-none text-white"
              >
                Submit
              </CustomButton>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default CreateSubmissionModal;
