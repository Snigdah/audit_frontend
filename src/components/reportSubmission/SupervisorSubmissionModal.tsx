import React, { useEffect, useRef, useState } from "react";
import { Modal, Spin, Button } from "antd";
import { X } from "lucide-react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import type Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { ReportSubmissionService } from "../../services/ReportSubmissionService";
import { ReportService } from "../../services/ReportService";
import type {
  CellChangeRequest,
  MergeCellDto,
  TemplateStructureRequest,
  ReportStructureResponse,
} from "../../types/reportSubmission";
import { toast } from "../common/Toast";
import CustomButton from "../common/CustomButton";
import { useAuth } from "../../context/AuthContext";

registerAllModules();

interface SupervisorSubmissionModalProps {
  reportId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Submission modal for Admin/Supervisor: can edit any cell (including existing values).
 * No structure changes: no row/col add/delete, no merge/unmerge, no context menu.
 */
const SupervisorSubmissionModal: React.FC<SupervisorSubmissionModalProps> = ({
  reportId,
  open,
  onClose,
  onSuccess,
}) => {
  const { authState } = useAuth();
  const hotRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [structure, setStructure] = useState<TemplateStructureRequest | null>(null);
  const [initialData, setInitialData] = useState<any[][] | null>(null);
  const [structureVersionId, setStructureVersionId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setStructure(null);
      setInitialData(null);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const response: ReportStructureResponse =
          await ReportService.fetchReport(reportId);
        const reportStructure = response.structure;
        setStructure(reportStructure);
        setInitialData(reportStructure.data.map((row) => [...row]));
        setStructureVersionId(response.versionId ?? null);
      } catch (err: any) {
        console.error("Error fetching report:", err);
        toast.error(
          err.response?.data?.devMessage ?? "Failed to load report structure"
        );
        setStructure(null);
        setStructureVersionId(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, reportId]);

  const handleSubmit = async () => {
    const hot = hotRef.current?.hotInstance as Handsontable | undefined;
    if (!hot || !structure || !initialData) return;

    if (structureVersionId == null) {
      toast.error("Report version information is missing. Please contact admin.");
      return;
    }
    setSubmitting(true);
    try {
      const currentData = hot.getData() as any[][];
      const changes: CellChangeRequest[] = [];
      const now = new Date().toISOString();
      const changedBy = authState.employeeId ?? "supervisor";
      for (let r = 0; r < currentData.length; r++) {
        for (let c = 0; c < (currentData[r]?.length ?? 0); c++) {
          const oldVal = initialData[r]?.[c];
          const newVal = currentData[r]?.[c];
          if (oldVal !== newVal) {
            const cellAddress = `${String.fromCharCode(65 + c)}${r + 1}`;
            changes.push({
              rowIndex: r,
              colIndex: c,
              cellAddress,
              oldValue: oldVal ?? null,
              newValue: newVal,
              changedBy,
              changedAt: now,
            });
          }
        }
      }
      // No structure change: use merge cells from structure only (no merge plugin read)
      const mergeCells: MergeCellDto[] = structure.mergeCells ?? [];
      await ReportSubmissionService.createSupervisorSubmission(
        reportId,
        structureVersionId,
        {
          templateStructure: {
            data: currentData,
            permissions: structure.permissions,
            mergeCells,
          },
          changes,
        }
      );
      toast.success("Submission created successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(
        err.response?.data?.devMessage ?? "Failed to create submission"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hotSettings =
    structure && initialData
      ? {
          data: initialData.map((row) => [...row]),
          colHeaders: true,
          rowHeaders: true,
          height: 500,
          width: "100%",
          licenseKey: "non-commercial-and-evaluation",
          contextMenu: false,
          manualRowResize: false,
          manualColumnResize: false,
          stretchH: "all" as const,
          autoWrapRow: true,
          autoWrapCol: true,
          mergeCells: (structure.mergeCells ?? []).map((mc) => ({
            row: mc.row,
            col: mc.col,
            rowspan: mc.rowspan,
            colspan: mc.colspan,
          })),
          cells: (row: number, col: number) => {
            const cellProps: any = { readOnly: false };
            if (row === 0) {
              cellProps.className = "header-cell";
            }
            return cellProps;
          },
        }
      : null;

  return (
    <>
      <style>{`
        .handsontable {
          font-size: 13px;
        }
        .handsontable td {
          border-color: #d9d9d9 !important;
        }
        .handsontable th {
          background-color: #fafafa !important;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          border-color: #d9d9d9 !important;
        }
        .header-cell {
          background-color: #f5f5f5 !important;
          font-weight: 600;
          text-align: center;
        }
        .handsontable td.htInvalid {
          background-color: inherit !important;
        }
        .handsontable .ht_master {
          overflow-x: auto;
          overflow-y: auto;
        }
      `}</style>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width="95%"
        style={{ maxWidth: 1400 }}
        closeIcon={<X size={20} />}
        maskClosable={!submitting}
        closable={!submitting}
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">
              Create submission (Admin / Supervisor)
            </span>
            <div className="text-xs text-gray-500">
              Edit any cell. Row/column and merge changes are not allowed.
            </div>
          </div>
        }
      >
        <div className="p-2">
          <p className="text-sm text-gray-600 mb-4">
            You can enter or edit data in any cell. Right-click menu and structure
            changes (add/remove rows or columns, merge/unmerge cells) are disabled.
          </p>
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <Spin tip="Loading report structure…" size="large" />
            </div>
          ) : hotSettings ? (
            <>
              <div className="border border-gray-300 rounded-lg overflow-auto mb-4 max-h-[70vh]">
                <HotTable ref={hotRef} settings={hotSettings} />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <Button onClick={onClose} disabled={submitting} size="large">
                  Cancel
                </Button>
                <CustomButton
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                  className="bg-gray-800 hover:bg-gray-700 border-none text-white"
                  size="large"
                >
                  Submit
                </CustomButton>
              </div>
            </>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center text-gray-500">
              Failed to load report structure
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SupervisorSubmissionModal;
