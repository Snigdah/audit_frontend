import React, { useEffect, useRef, useState } from "react";
import { Modal, Spin, Button, Steps } from "antd";
import {
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
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

const DEFAULT_PERMISSION = ["admin", "supervisor", "operator"];

function buildEffectivePermissions(
  data: any[][],
  mergeCells: MergeCellDto[],
  basePermissions: string[][][]
): string[][][] {
  const rows = data.length;
  const cols = data[0]?.length ?? 0;
  const effective: string[][][] = [];
  for (let r = 0; r < rows; r++) {
    effective[r] = [];
    for (let c = 0; c < cols; c++) {
      effective[r][c] = basePermissions[r]?.[c]?.length
        ? [...basePermissions[r][c]]
        : [...DEFAULT_PERMISSION];
    }
  }
  for (const mc of mergeCells) {
    const topLeft = effective[mc.row]?.[mc.col] ?? [...DEFAULT_PERMISSION];
    for (let r = mc.row; r < mc.row + mc.rowspan; r++) {
      for (let c = mc.col; c < mc.col + mc.colspan; c++) {
        if (effective[r]?.[c]) effective[r][c] = [...topLeft];
      }
    }
  }
  return effective;
}

interface SupervisorStructureChangeModalProps {
  reportId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SupervisorStructureChangeModal: React.FC<
  SupervisorStructureChangeModalProps
> = ({ reportId, open, onClose, onSuccess }) => {
  const { authState } = useAuth();
  const hotRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [initialData, setInitialData] = useState<any[][] | null>(null);
  const [initialStructure, setInitialStructure] =
    useState<TemplateStructureRequest | null>(null);
  const [structure, setStructure] = useState<TemplateStructureRequest | null>(
    null
  );
  const [structureVersionId, setStructureVersionId] = useState<number | null>(
    null
  );

  const [selectedCells, setSelectedCells] = useState<
    Array<{ row: number; col: number }>
  >([]);

  useEffect(() => {
    if (!open) {
      setStructure(null);
      setInitialData(null);
      setInitialStructure(null);
      setCurrentStep(0);
      setSelectedCells([]);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const response: ReportStructureResponse =
          await ReportService.fetchReport(reportId);
        const s = response.structure;
        setInitialStructure(s);
        setInitialData(s.data.map((row) => [...row]));
        setStructure(s);
        setStructureVersionId(response.versionId ?? null);
      } catch (err: any) {
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

  // ──────────────────────── Step 1 helpers ────────────────────────
  const addRow = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot) hot.alter("insert_row_below", hot.countRows() - 1);
  };
  const addColumn = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot) hot.alter("insert_col_end");
  };

  const handleStep1Next = () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !structure) return;

    const tableData = hot.getData() as any[][];
    const mergePlugin = hot.getPlugin("mergeCells");
    const mergeCells: MergeCellDto[] =
      (mergePlugin as any)?.mergedCellsCollection?.mergedCells?.map(
        (mc: any) => ({
          row: mc.row,
          col: mc.col,
          rowspan: mc.rowspan,
          colspan: mc.colspan,
        })
      ) ?? [];

    const newPermissions: string[][][] = tableData.map(
      (row: any[], rowIdx: number) =>
        row.map(
          (_, colIdx: number) =>
            structure.permissions[rowIdx]?.[colIdx] ?? [...DEFAULT_PERMISSION]
        )
    );

    const effective = buildEffectivePermissions(
      tableData,
      mergeCells,
      newPermissions
    );

    setStructure({
      data: tableData,
      permissions: effective,
      mergeCells,
    });
    setSelectedCells([]);
    setCurrentStep(1);
  };

  // ──────────────────────── Step 2 helpers ────────────────────────
  const isCellInMerge = (
    row: number,
    col: number
  ): { isMerged: boolean; mainCell?: { row: number; col: number } } => {
    const mc = structure?.mergeCells ?? [];
    for (const merge of mc) {
      if (
        row >= merge.row &&
        row < merge.row + merge.rowspan &&
        col >= merge.col &&
        col < merge.col + merge.colspan
      ) {
        return { isMerged: true, mainCell: { row: merge.row, col: merge.col } };
      }
    }
    return { isMerged: false };
  };

  const handlePermCellClick = (row: number, col: number) => {
    const mergeInfo = isCellInMerge(row, col);
    const targetRow = mergeInfo.mainCell?.row ?? row;
    const targetCol = mergeInfo.mainCell?.col ?? col;

    if (mergeInfo.isMerged && mergeInfo.mainCell) {
      const merge = (structure?.mergeCells ?? []).find(
        (m) =>
          m.row === mergeInfo.mainCell!.row && m.col === mergeInfo.mainCell!.col
      );
      if (merge) {
        const cells: Array<{ row: number; col: number }> = [];
        for (let r = merge.row; r < merge.row + merge.rowspan; r++)
          for (let c = merge.col; c < merge.col + merge.colspan; c++)
            cells.push({ row: r, col: c });
        const allSelected = cells.every((cell) =>
          selectedCells.some(
            (sc) => sc.row === cell.row && sc.col === cell.col
          )
        );
        if (allSelected) {
          setSelectedCells(
            selectedCells.filter(
              (sc) => !cells.some((c) => c.row === sc.row && c.col === sc.col)
            )
          );
        } else {
          const next = [...selectedCells];
          cells.forEach((c) => {
            if (!next.some((sc) => sc.row === c.row && sc.col === c.col))
              next.push(c);
          });
          setSelectedCells(next);
        }
        return;
      }
    }
    const exists = selectedCells.some(
      (c) => c.row === targetRow && c.col === targetCol
    );
    if (exists)
      setSelectedCells(
        selectedCells.filter(
          (c) => !(c.row === targetRow && c.col === targetCol)
        )
      );
    else setSelectedCells([...selectedCells, { row: targetRow, col: targetCol }]);
  };

  const toggleSupervisorOnly = () => {
    if (!structure) return;
    const perms = structure.permissions.map((r) => r.map((c) => [...c]));
    selectedCells.forEach(({ row, col }) => {
      if (perms[row]?.[col]) {
        const isSup = !perms[row][col].includes("operator");
        perms[row][col] = isSup
          ? [...DEFAULT_PERMISSION]
          : ["admin", "supervisor"];
      }
    });
    setStructure({ ...structure, permissions: perms });
    setSelectedCells([]);
  };

  const getCellDisplay = (
    row: number,
    col: number
  ): { display: boolean; value: string } => {
    for (const merge of structure?.mergeCells ?? []) {
      if (
        row >= merge.row &&
        row < merge.row + merge.rowspan &&
        col >= merge.col &&
        col < merge.col + merge.colspan
      ) {
        if (row === merge.row && col === merge.col)
          return { display: true, value: structure?.data[row]?.[col] ?? "" };
        return { display: false, value: "" };
      }
    }
    return { display: true, value: structure?.data[row]?.[col] ?? "" };
  };

  const getCellSpan = (
    row: number,
    col: number
  ): { rowSpan: number; colSpan: number } => {
    const merge = (structure?.mergeCells ?? []).find(
      (m) => m.row === row && m.col === col
    );
    if (merge) return { rowSpan: merge.rowspan, colSpan: merge.colspan };
    return { rowSpan: 1, colSpan: 1 };
  };

  // ──────────────────────── Step 3 submit ────────────────────────
  const handleSubmit = async () => {
    if (!structure || !initialData) return;
    setSubmitting(true);
    try {
      const effectivePermissions = buildEffectivePermissions(
        structure.data,
        structure.mergeCells ?? [],
        structure.permissions
      );

      const changes: CellChangeRequest[] = [];
      const now = new Date().toISOString();
      const changedBy = authState.employeeId ?? "supervisor";
      for (let r = 0; r < structure.data.length; r++) {
        for (let c = 0; c < (structure.data[r]?.length ?? 0); c++) {
          const oldVal = initialData[r]?.[c];
          const newVal = structure.data[r]?.[c];
          if (oldVal !== newVal) {
            changes.push({
              rowIndex: r,
              colIndex: c,
              cellAddress: `${String.fromCharCode(65 + c)}${r + 1}`,
              oldValue: oldVal ?? null,
              newValue: newVal,
              changedBy,
              changedAt: now,
            });
          }
        }
      }

      await ReportSubmissionService.changeSupervisorStructure(reportId, {
        templateStructure: {
          data: structure.data,
          permissions: effectivePermissions,
          mergeCells: structure.mergeCells ?? [],
        },
        changes,
      });
      toast.success("Structure change request submitted");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err.response?.data?.devMessage ?? "Failed to submit structure change"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ──────────────────────── Render helpers ────────────────────────
  const hotSettings =
    structure && initialStructure
      ? {
          data: structure.data.map((r) => [...r]),
          colHeaders: true,
          rowHeaders: true,
          height: "auto",
          width: "100%",
          licenseKey: "non-commercial-and-evaluation",
          contextMenu: true,
          manualRowResize: true,
          manualColumnResize: true,
          stretchH: "all" as const,
          autoWrapRow: true,
          autoWrapCol: true,
          mergeCells:
            structure.mergeCells?.map((mc) => ({
              row: mc.row,
              col: mc.col,
              rowspan: mc.rowspan,
              colspan: mc.colspan,
            })) ?? [],
        }
      : null;

  const mergeCount = structure?.mergeCells?.length ?? 0;
  const operatorEditable =
    structure?.permissions.flat().filter((p) => p.includes("operator")).length ??
    0;
  const supervisorOnly =
    structure?.permissions.flat().filter((p) => !p.includes("operator"))
      .length ?? 0;

  const renderStep1 = () => (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Edit Table Structure
      </h2>

      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Edit any cell value. Right-click for merge/unmerge, add/remove rows
          and columns. Use the buttons below to quickly add rows or columns.
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button onClick={addRow} className="flex items-center gap-2">
          <Plus size={16} /> Add Row
        </Button>
        <Button onClick={addColumn} className="flex items-center gap-2">
          <Plus size={16} /> Add Column
        </Button>
      </div>

      <div
        className="border-2 border-gray-300 rounded-lg overflow-auto mb-6 shadow-sm"
        style={{ maxHeight: "60vh" }}
      >
        {hotSettings && <HotTable ref={hotRef} settings={hotSettings} />}
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-between">
        <Button
          onClick={onClose}
          className="border border-gray-300 hover:bg-gray-50"
          size="large"
        >
          Cancel
        </Button>
        <CustomButton
          onClick={handleStep1Next}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="large"
        >
          Next <ArrowRight size={18} className="ml-2" />
        </CustomButton>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Set Cell Permissions
      </h2>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Click cells to select them, then click &quot;Set Supervisor-Only&quot;
          to restrict editing. Click again to toggle back. Merged areas use the
          top-left cell&apos;s permission.
        </p>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <Button
          onClick={() => setSelectedCells([])}
          disabled={selectedCells.length === 0}
          className="border border-gray-300 hover:bg-gray-50"
        >
          Clear ({selectedCells.length})
        </Button>
        {selectedCells.length > 0 && (
          <Button
            onClick={toggleSupervisorOnly}
            className="bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1"
          >
            <Lock size={16} /> Toggle Supervisor-Only ({selectedCells.length})
          </Button>
        )}
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border-2 border-green-400" />
          <span>Operator &amp; Supervisor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-50 border-2 border-orange-400" />
          <span>Supervisor Only</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border-2 border-blue-500" />
          <span>Selected</span>
        </div>
      </div>

      <div
        className="border-2 border-gray-300 rounded-lg overflow-auto mb-6 shadow-sm"
        style={{ maxHeight: "50vh" }}
      >
        <table className="w-full border-collapse min-w-full">
          <tbody>
            {structure?.data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((_: any, colIdx: number) => {
                  const cd = getCellDisplay(rowIdx, colIdx);
                  if (!cd.display) return null;
                  const cs = getCellSpan(rowIdx, colIdx);
                  const isSelected = selectedCells.some(
                    (c) => c.row === rowIdx && c.col === colIdx
                  );
                  const perms =
                    structure.permissions[rowIdx]?.[colIdx] ??
                    DEFAULT_PERMISSION;
                  const isSup = !perms.includes("operator");
                  return (
                    <td
                      key={colIdx}
                      rowSpan={cs.rowSpan}
                      colSpan={cs.colSpan}
                      onClick={() => handlePermCellClick(rowIdx, colIdx)}
                      className={`border-2 p-4 cursor-pointer transition-colors min-w-[120px] ${
                        isSelected
                          ? "bg-blue-200 border-blue-500"
                          : isSup
                            ? "bg-orange-50 border-orange-300"
                            : "bg-white hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{cd.value}</span>
                        {isSup && (
                          <Lock
                            size={14}
                            className="text-orange-500 flex-shrink-0"
                          />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between text-sm flex-wrap gap-2">
        <div>
          <span className="text-gray-600">Total Cells: </span>
          <span className="font-medium">
            {structure?.data.flat().length ?? 0}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Operator Editable: </span>
          <span className="font-medium text-green-600">{operatorEditable}</span>
        </div>
        <div>
          <span className="text-gray-600">Supervisor Only: </span>
          <span className="font-medium text-orange-600">{supervisorOnly}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-between">
        <Button
          onClick={() => setCurrentStep(0)}
          className="border border-gray-300 hover:bg-gray-50"
          size="large"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <CustomButton
          onClick={() => {
            setSelectedCells([]);
            setCurrentStep(2);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="large"
        >
          Next <ArrowRight size={18} className="ml-2" />
        </CustomButton>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="p-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Review &amp; Submit
      </h2>

      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle
            size={22}
            className="text-green-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <h3 className="font-semibold text-green-800">Ready to Submit</h3>
            <p className="text-green-700 text-sm mt-1">
              Review the structure and permissions below before submitting the
              change request.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-2">
        <h3 className="font-semibold text-gray-800 mb-3">Structure Preview</h3>
        <div className="mb-3 text-sm text-gray-600">
          {structure?.data.length ?? 0} rows ×{" "}
          {structure?.data[0]?.length ?? 0} columns
          {mergeCount > 0 && ` • ${mergeCount} merged regions`}
        </div>

        <div className="mb-3 flex items-center gap-3 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-400" />
            <span>Operator &amp; Supervisor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-50 border-2 border-orange-400" />
            <span>Supervisor Only</span>
          </div>
        </div>

        <div
          className="border-2 border-gray-200 rounded-lg overflow-auto shadow-sm"
          style={{ maxHeight: "45vh" }}
        >
          <table className="w-full border-collapse min-w-full">
            <tbody>
              {structure?.data.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((_: any, colIdx: number) => {
                    const cd = getCellDisplay(rowIdx, colIdx);
                    if (!cd.display) return null;
                    const cs = getCellSpan(rowIdx, colIdx);
                    const perms =
                      structure.permissions[rowIdx]?.[colIdx] ??
                      DEFAULT_PERMISSION;
                    const isSup = !perms.includes("operator");
                    return (
                      <td
                        key={colIdx}
                        rowSpan={cs.rowSpan}
                        colSpan={cs.colSpan}
                        className={`border-2 p-4 text-sm font-medium min-w-[120px] ${
                          isSup
                            ? "bg-orange-50 border-orange-300"
                            : "bg-green-50 border-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{cd.value}</span>
                          {isSup && (
                            <Lock
                              size={14}
                              className="text-orange-600 flex-shrink-0"
                            />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-yellow-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notice</h4>
            <p className="text-yellow-700 text-sm mt-1">
              This structure change request will be submitted for admin approval.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-between">
        <Button
          onClick={() => setCurrentStep(1)}
          disabled={submitting}
          className="border border-gray-300 hover:bg-gray-50"
          size="large"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <CustomButton
          onClick={handleSubmit}
          loading={submitting}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="large"
        >
          <Save size={18} className="mr-2" /> Submit for Approval
        </CustomButton>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .handsontable { font-size: 13px; }
        .handsontable td, .handsontable th { border-color: #d9d9d9 !important; }
        .handsontable th { background-color: #fafafa !important; font-weight: 500; }
        .handsontable .ht_master { overflow-x: auto; overflow-y: auto; }
      `}</style>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width="95%"
        style={{ maxWidth: 1400, top: 20 }}
        closeIcon={<X size={20} />}
        maskClosable={!submitting}
        closable={!submitting}
        title={
          <span className="text-lg font-semibold text-gray-800">
            Structure Change Request
          </span>
        }
      >
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Spin tip="Loading report structure…" size="large" />
          </div>
        ) : structure ? (
          <div className="px-2 pt-4">
            <Steps
              current={currentStep}
              className="mb-6"
              items={[
                { title: "Edit Structure" },
                { title: "Set Permissions" },
                { title: "Review & Submit" },
              ]}
            />
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
          </div>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center text-gray-500">
            Failed to load report structure
          </div>
        )}
      </Modal>
    </>
  );
};

export default SupervisorStructureChangeModal;
