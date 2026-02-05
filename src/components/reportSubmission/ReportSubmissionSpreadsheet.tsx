import { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import type { MergeCellDto, CellChangeRequest } from "../../types/reportSubmission";

interface ReportSubmissionSpreadsheetProps {
  data: any[][];
  permissions: string[][][];
  mergeCells?: MergeCellDto[];
  changes?: CellChangeRequest[];
}

const ReportSubmissionSpreadsheet = ({
  data,
  permissions,
  mergeCells,
  changes = [],
}: ReportSubmissionSpreadsheetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotRef = useRef<Handsontable | null>(null);

  const changedCellsSet = new Set(
    changes.map((c) => `${c.rowIndex}-${c.colIndex}`)
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const hasOperatorPermission = (row: number, col: number): boolean => {
      if (!permissions || !permissions[row] || !permissions[row][col]) {
        return false;
      }
      return permissions[row][col].includes("operator");
    };

    const getCellClassName = (row: number, col: number): string => {
      if (!permissions || !permissions[row] || !permissions[row][col]) {
        return "no-permission-cell";
      }
      
      const cellPermissions = permissions[row][col];
      
      if (!cellPermissions.includes("operator")) {
        return "no-permission-cell";
      }
      
      if (cellPermissions.length < 3) {
        return "restricted-cell";
      }
      
      return "";
    };

    hotRef.current = new Handsontable(containerRef.current, {
      data: data,
      colHeaders: true,
      rowHeaders: true,
      width: "100%",
      height: "auto",
      readOnly: true,
      stretchH: "all",
      autoWrapRow: true,
      autoWrapCol: true,
      manualRowResize: true,
      manualColumnResize: true,
      contextMenu: false,
      licenseKey: "non-commercial-and-evaluation",
      mergeCells: mergeCells?.map((mc) => ({
        row: mc.row,
        col: mc.col,
        rowspan: mc.rowspan,
        colspan: mc.colspan,
      })) || [],
      cells: function (row, col) {
        const cellProperties: any = {};
        const baseClassName = getCellClassName(row, col);
        const isChanged = changedCellsSet.has(`${row}-${col}`);
        
        let className = "";
        if (row === 0) {
          className = (baseClassName ? baseClassName + " " : "") + "header-cell";
        } else {
          className = baseClassName || "";
        }
        
        if (isChanged) {
          className = (className ? className + " " : "") + "changed-cell";
        }
        
        if (className) {
          cellProperties.className = className.trim();
        }
        
        return cellProperties;
      },
    });

    return () => {
      if (hotRef.current) {
        hotRef.current.destroy();
      }
    };
  }, [data, permissions, mergeCells, changes]);

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
        }
        
        .no-permission-cell {
          background-color: #fff1f0 !important;
          border: 1px solid #ffccc7 !important;
        }
        
        .restricted-cell {
          background-color: #fff7e6 !important;
          border: 1px solid #ffd591 !important;
        }
        
        .changed-cell {
          background-color: #e6f7ff !important;
          border: 2px solid #1890ff !important;
          font-weight: 500;
        }
        
        .changed-cell.no-permission-cell {
          background-color: #fff1f0 !important;
          border: 2px solid #ff4d4f !important;
        }
        
        .changed-cell.restricted-cell {
          background-color: #fff7e6 !important;
          border: 2px solid #faad14 !important;
        }
        
        .handsontable td.htInvalid {
          background-color: inherit !important;
        }
      `}</style>
      <div ref={containerRef} className="border border-gray-300 rounded" />
    </>
  );
};

export default ReportSubmissionSpreadsheet;
