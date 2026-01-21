import { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import type { MergeCellDto } from "../../types/template";

interface TemplateSpreadsheetProps {
  data: any[][];
  permissions: string[][][];
  mergeCells?: MergeCellDto[];
}

const TemplateSpreadsheet = ({
  data,
  permissions,
  mergeCells,
}: TemplateSpreadsheetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotRef = useRef<Handsontable | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if user has "operator" permission for a cell
    const hasOperatorPermission = (row: number, col: number): boolean => {
      if (!permissions || !permissions[row] || !permissions[row][col]) {
        return false;
      }
      return permissions[row][col].includes("operator");
    };

    // Determine cell background color based on permissions
    const getCellClassName = (row: number, col: number): string => {
      if (!permissions || !permissions[row] || !permissions[row][col]) {
        return "no-permission-cell";
      }
      
      const cellPermissions = permissions[row][col];
      
      // No operator permission - red background
      if (!cellPermissions.includes("operator")) {
        return "no-permission-cell";
      }
      
      // Has operator but limited permissions - orange background
      if (cellPermissions.length < 3) {
        return "restricted-cell";
      }
      
      // Full permissions - default white
      return "";
    };

    // Initialize Handsontable
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
        
        // Apply custom className based on permissions
        cellProperties.className = getCellClassName(row, col);
        
        // Make header row bold
        if (row === 0) {
          cellProperties.className += " header-cell";
        }
        
        return cellProperties;
      },
    });

    // Cleanup on unmount
    return () => {
      if (hotRef.current) {
        hotRef.current.destroy();
      }
    };
  }, [data, permissions, mergeCells]);

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
      `}</style>
      <div ref={containerRef} className="border border-gray-300 rounded" />
    </>
  );
};

export default TemplateSpreadsheet;