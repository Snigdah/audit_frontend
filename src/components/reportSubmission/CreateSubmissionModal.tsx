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
  const hotRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [structure, setStructure] = useState<TemplateStructureRequest | null>(null);
  const [initialData, setInitialData] = useState<any[][] | null>(null);
  const [structureVersionId, setStructureVersionId] = useState<number | null>(
    null
  );

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
        toast.error(err.response?.data?.devMessage ?? "Failed to load report structure");
        setStructure(null);
        setStructureVersionId(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, reportId]);

  const hasOperatorPermission = (row: number, col: number): boolean => {
    if (!structure?.permissions?.[row]?.[col]) return false;
    return structure.permissions[row][col].includes("operator");
  };

  const hasExistingValue = (row: number, col: number): boolean => {
    if (!initialData?.[row]?.[col]) return false;
    const v = initialData[row][col];
    return v !== "" && v != null && String(v).trim() !== "";
  };

  const getCellClassName = (row: number, col: number): string => {
    if (!structure?.permissions?.[row]?.[col]) {
      return "no-permission-cell";
    }
    const cellPermissions = structure.permissions[row][col];
    if (!cellPermissions.includes("operator")) {
      return "no-permission-cell";
    }
    if (cellPermissions.length < 3) {
      return "restricted-cell";
    }
    return "";
  };

  const handleSubmit = async () => {
    const hot = hotRef.current?.hotInstance as Handsontable | undefined;
    if (!hot || !structure || !initialData) return;

    // versionId is required by backend; block submission if missing
    if (structureVersionId == null) {
      toast.error("Report version information is missing. Please contact admin.");
      return;
    }
    setSubmitting(true);
    try {
      const currentData = hot.getData() as any[][];
      const changes: CellChangeRequest[] = [];
      const now = new Date().toISOString();
      const changedBy = authState.employeeId ?? "operator";
      for (let r = 0; r < currentData.length; r++) {
        for (let c = 0; c < (currentData[r]?.length ?? 0); c++) {
          const oldVal = initialData[r]?.[c];
          const newVal = currentData[r]?.[c];
          if (
            oldVal !== newVal &&
            hasOperatorPermission(r, c) &&
            !hasExistingValue(r, c)
          ) {
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
        structureVersionId,
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
      toast.success("Submission created successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.devMessage ?? "Failed to create submission");
    } finally {
      setSubmitting(false);
    }
  };

  const hotSettings = structure && initialData
    ? {
        data: initialData.map((row) => [...row]),
        colHeaders: true,
        rowHeaders: true,
        height: 500,
        width: "100%",
        licenseKey: "non-commercial-and-evaluation",
        contextMenu: false,
        manualRowResize: true,
        manualColumnResize: true,
        stretchH: "all" as const,
        autoWrapRow: true,
        autoWrapCol: true,
        mergeCells: structure.mergeCells?.map((mc) => ({
          row: mc.row,
          col: mc.col,
          rowspan: mc.rowspan,
          colspan: mc.colspan,
        })) || [],
        cells: (row: number, col: number) => {
          const readOnly =
            hasExistingValue(row, col) || !hasOperatorPermission(row, col);
          const className = getCellClassName(row, col);
          const cellProps: any = { readOnly };
          if (row === 0) {
            cellProps.className = (className ? className + " " : "") + "header-cell";
          } else if (className) {
            cellProps.className = className;
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
        
        .no-permission-cell {
          background-color: #fff1f0 !important;
          border: 1px solid #ffccc7 !important;
        }
        
        .restricted-cell {
          background-color: #fff7e6 !important;
          border: 1px solid #ffd591 !important;
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
              Create submission
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-white border border-gray-300 rounded"></span>
                <span className="text-gray-600">Editable (empty)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-orange-50 border border-orange-200 rounded"></span>
                <span className="text-gray-600">Restricted</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-50 border border-red-200 rounded"></span>
                <span className="text-gray-600">No Access</span>
              </span>
            </div>
          </div>
        }
      >
        <div className="p-2">
          <p className="text-sm text-gray-600 mb-4">
            Fill only empty cells. Existing values are read-only. Only cells with operator permission can be edited.
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

export default CreateSubmissionModal;
