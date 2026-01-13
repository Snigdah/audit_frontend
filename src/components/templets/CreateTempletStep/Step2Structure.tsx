// ============================================
// Step2Structure.tsx
// ============================================
import React, { useRef, useEffect } from "react";
import { Button } from "antd";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import type { 
  MergeCellDto, 
  TemplateStructureRequest 
} from "../../../types/template";
import "handsontable/dist/handsontable.min.css";
import CustomButton from "../../common/CustomButton";

registerAllModules();

interface Step2StructureProps {
  initialStructure?: TemplateStructureRequest | null;
  onBack: () => void;
  onNext: (data: TemplateStructureRequest) => void;
}

const Step2Structure: React.FC<Step2StructureProps> = ({ initialStructure, onBack, onNext }) => {
  const hotRef = useRef<any>(null);
  
  // If we already have a structure from Step 3, use it. Otherwise use default.
  const defaultStructure: TemplateStructureRequest = {
    data: [
      ["Field Name", "Value", "Notes", "Status"],
      ["Temperature", "", "", ""],
      ["Pressure", "", "", ""],
      ["Visual Inspection", "", "", ""],
    ],
    permissions: Array(4).fill(null).map(() => 
      Array(4).fill(["admin", "supervisor", "operator"])
    ),
    mergeCells: [],
  };

  const structure = initialStructure || defaultStructure;

  // Load handsontable data on mount
  useEffect(() => {
    if (hotRef.current?.hotInstance && initialStructure) {
      const hot = hotRef.current.hotInstance;
      hot.loadData(initialStructure.data);

      if (initialStructure.mergeCells?.length) {
        const mergePlugin = hot.getPlugin("mergeCells");
        mergePlugin.clearCollections();
        initialStructure.mergeCells.forEach((merge) => {
          mergePlugin.merge(
            merge.row,
            merge.col,
            merge.row + merge.rowspan - 1,
            merge.col + merge.colspan - 1
          );
        });
      }
    }
  }, [initialStructure]);

  const handleNext = (): void => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const tableData = hot.getData();
    const mergePlugin = hot.getPlugin("mergeCells");
    const mergeCells: MergeCellDto[] = mergePlugin?.mergedCellsCollection?.mergedCells?.map((mc: any) => ({
      row: mc.row,
      col: mc.col,
      rowspan: mc.rowspan,
      colspan: mc.colspan,
    })) || [];

    // --- Preserve existing permissions where possible ---
    const newPermissions: string[][][] = tableData.map((row: any[], rowIdx: number) =>
      row.map((_, colIdx: number) =>
        // Keep previous permission if exists, otherwise default
        structure.permissions[rowIdx]?.[colIdx] || ["admin", "supervisor", "operator"]
      )
    );

    const newStructure: TemplateStructureRequest = {
      data: tableData,
      permissions: newPermissions,
      mergeCells: mergeCells,
    };

    onNext(newStructure);
  };

  const addRow = (): void => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      hot.alter("insert_row_below", hot.countRows() - 1);
    }
  };

  const addColumn = (): void => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      hot.alter("insert_col_end");
    }
  };

  const hotSettings = {
    data: structure.data,
    colHeaders: true,
    rowHeaders: true,
    height: 500,
    width: "100%",
    licenseKey: "non-commercial-and-evaluation",
    contextMenu: true,
    manualRowResize: true,
    manualColumnResize: true,
    mergeCells: structure.mergeCells,
    stretchH: "all" as const,
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Design Table Structure</h2>
      
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Right-click on cells to merge, add/remove rows and columns. Enter values directly in cells.
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

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6 shadow-sm">
        <HotTable ref={hotRef} settings={hotSettings} />
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-between">
        <Button
          onClick={onBack}
          className="border border-gray-300 hover:bg-gray-50"
          size="large"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        
        <CustomButton
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="large"
        >
          Next <ArrowRight size={18} className="ml-2" />
        </CustomButton>
      </div>
    </div>
  );
};

export default Step2Structure;