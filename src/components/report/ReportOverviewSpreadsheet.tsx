import { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import type { MergeCellDto } from "../../types/reportSubmission";

interface ReportOverviewSpreadsheetProps {
  data: any[][];
  permissions: string[][][];
  mergeCells?: MergeCellDto[];
}

/**
 * Read-only spreadsheet for report overview. Colors cells by permission:
 * - Admin/Supervisor only (no operator): distinct style
 * - Restricted (operator partial): restricted style
 * - Full access: default clean style
 */
const ReportOverviewSpreadsheet = ({
  data,
  permissions,
  mergeCells,
}: ReportOverviewSpreadsheetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotRef = useRef<Handsontable | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data?.length) return;

    const columnCount = Math.max(...data.map((row) => row?.length ?? 0), 0);

    const computedColWidths = Array.from({ length: columnCount }, (_, colIdx) => {
      let maxLen = 0;

      for (let rowIdx = 0; rowIdx < Math.min(data.length, 120); rowIdx += 1) {
        const cellValue = data[rowIdx]?.[colIdx];
        const cellText = String(cellValue ?? "");
        if (cellText.length > maxLen) {
          maxLen = cellText.length;
        }
      }

      // Keeps columns readable while still allowing horizontal scrolling for dense sheets.
      return Math.min(Math.max(maxLen * 7.5, 120), 340);
    });

    const getCellClassName = (row: number, col: number): string => {
      if (!permissions?.[row]?.[col]) {
        return "overview-admin-only-cell";
      }
      const cellPermissions = permissions[row][col];
      if (!cellPermissions.includes("operator")) {
        return "overview-admin-only-cell";
      }
      if (cellPermissions.length < 3) {
        return "overview-restricted-cell";
      }
      return "overview-default-cell";
    };

    hotRef.current = new Handsontable(containerRef.current, {
      data,
      colHeaders: true,
      rowHeaders: true,
      width: "100%",
      height: "70vh",
      readOnly: true,
      stretchH: "none",
      autoWrapRow: false,
      autoWrapCol: false,
      wordWrap: true,
      autoRowSize: true,
      colWidths: computedColWidths,
      manualRowResize: false,
      manualColumnResize: false,
      contextMenu: false,
      copyPaste: true,
      navigableHeaders: true,
      viewportRowRenderingOffset: 30,
      viewportColumnRenderingOffset: 10,
      licenseKey: "non-commercial-and-evaluation",
      mergeCells:
        mergeCells?.map((mc) => ({
          row: mc.row,
          col: mc.col,
          rowspan: mc.rowspan,
          colspan: mc.colspan,
        })) || [],
      cells(row: number, col: number) {
        const baseClassName = getCellClassName(row, col);
        let className = baseClassName;
        if (row === 0) {
          className = `overview-header-cell ${baseClassName}`.trim();
        }
        return {
          className: `${className} overview-cell-wrap`.trim(),
        };
      },
    });

    return () => {
      if (hotRef.current) {
        hotRef.current.destroy();
        hotRef.current = null;
      }
    };
  }, [data, permissions, mergeCells]);

  return (
    <>
      <style>{`
        .report-overview-sheet {
          font-size: 13px;
          --overview-border: 1px solid #e5e7eb;
        }
        .report-overview-sheet .handsontable {
          font-size: 13px;
        }
        .report-overview-sheet td {
          border-color: #e5e7eb !important;
          vertical-align: top !important;
          white-space: normal !important;
          overflow-wrap: anywhere;
          word-break: break-word;
          line-height: 1.35;
          padding-top: 6px !important;
          padding-bottom: 6px !important;
        }
        .report-overview-sheet th {
          background-color: #f8fafc !important;
          font-weight: 600;
          color: #334155;
          border-color: #e5e7eb !important;
          font-size: 12px;
        }
        .report-overview-sheet .overview-header-cell {
          background-color: #f1f5f9 !important;
          color: #475569;
          font-weight: 600;
        }
        .report-overview-sheet .overview-default-cell {
          background-color: #ffffff !important;
          color: #1e293b;
        }
        .report-overview-sheet .overview-admin-only-cell {
          background-color: #eff6ff !important;
          border-color: #bfdbfe !important;
          color: #1e40af;
        }
        .report-overview-sheet .overview-restricted-cell {
          background-color: #fffbeb !important;
          border-color: #fde68a !important;
          color: #92400e;
        }
        .report-overview-sheet .ht_master .wtHolder {
          overflow: auto !important;
        }
        .report-overview-sheet .wtHolder::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .report-overview-sheet .wtHolder::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
        .report-overview-sheet .wtHolder::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .report-overview-sheet .handsontable td.htInvalid {
          background-color: inherit !important;
        }
        .report-overview-sheet .overview-cell-wrap {
          white-space: normal !important;
          text-overflow: clip !important;
        }
        @media (max-width: 640px) {
          .report-overview-sheet .handsontable {
            font-size: 12px;
          }
          .report-overview-sheet th {
            font-size: 11px;
          }
        }
      `}</style>
      <div className="report-overview-sheet border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white border border-gray-300" />
            Full access
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
            Admin / Supervisor only
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200" />
            Restricted
          </span>
          <span className="text-gray-400">
            Scroll horizontally and vertically to view full sheet
          </span>
        </div>
        <div
          ref={containerRef}
          className="min-h-[220px] max-h-[70vh] overflow-auto overscroll-contain"
        />
      </div>
    </>
  );
};

export default ReportOverviewSpreadsheet;
