// ============================================
// Step2Structure.tsx
// ============================================
import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { ArrowLeft, ArrowRight, Grid, Lock, Plus } from "lucide-react";
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
  onBack: () => void;
  onNext: (data: TemplateStructureRequest) => void;
}

const Step2Structure: React.FC<Step2StructureProps> = ({ onBack, onNext }) => {
  const hotRef = useRef<any>(null);
  const [selectedCells, setSelectedCells] = useState<Array<{row: number, col: number}>>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  
  // Default structure
  const [structure, setStructure] = useState<TemplateStructureRequest>({
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
  });

  // Initialize Handsontable
  useEffect(() => {
    if (hotRef.current?.hotInstance) {
      const hot = hotRef.current.hotInstance;
      hot.updateSettings({
        mergeCells: structure.mergeCells,
      });
    }
  }, [structure.mergeCells]);

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

    const newStructure: TemplateStructureRequest = {
      data: tableData,
      permissions: structure.permissions,
      mergeCells: mergeCells,
    };

    // Update permissions array size if needed
    if (tableData.length !== structure.permissions.length || 
        tableData[0]?.length !== structure.permissions[0]?.length) {
      newStructure.permissions = Array(tableData.length).fill(null).map(() => 
        Array(tableData[0].length).fill(["admin", "supervisor", "operator"])
      );
    }

    setStructure(newStructure);
    onNext(newStructure);
  };

  const handleCellClick = (row: number, col: number): void => {
    if (!isSelecting) return;

    const exists = selectedCells.some((c) => c.row === row && c.col === col);
    
    if (exists) {
      setSelectedCells(selectedCells.filter((c) => !(c.row === row && c.col === col)));
    } else {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const setSupervisorOnly = (): void => {
    const newPermissions = structure.permissions.map((row) => row.map((cell) => [...cell]));
    
    selectedCells.forEach(({ row, col }) => {
      if (newPermissions[row]?.[col]) {
        newPermissions[row][col] = ["admin", "supervisor"];
      }
    });

    setStructure({ ...structure, permissions: newPermissions });
    setSelectedCells([]);
    setIsSelecting(false);
  };

  const addRow = (): void => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      hot.alter("insert_row", structure.data.length);
    }
  };

  const addColumn = (): void => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      hot.alter("insert_col", structure.data[0]?.length || 0);
    }
  };

  const hotSettings = {
    data: structure.data,
    colHeaders: true,
    rowHeaders: true,
    height: 400,
    width: "100%",
    licenseKey: "non-commercial-and-evaluation",
    contextMenu: true,
    manualRowResize: true,
    manualColumnResize: true,
    mergeCells: structure.mergeCells,
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Design Template Structure</h2>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Design your template structure below. Right-click on cells for options to merge, add rows/columns, or clear data.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button onClick={addRow} className="flex items-center gap-2">
          <Plus size={16} /> Add Row
        </Button>
        <Button onClick={addColumn} className="flex items-center gap-2">
          <Plus size={16} /> Add Column
        </Button>
        <Button 
          onClick={() => setIsSelecting(!isSelecting)}
          className={`flex items-center gap-2 ${isSelecting ? 'bg-blue-600 text-white' : ''}`}
        >
          <Grid size={16} /> {isSelecting ? 'Cancel Selection' : 'Select Cells'}
        </Button>
        
        {selectedCells.length > 0 && (
          <Button 
            onClick={setSupervisorOnly}
            className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
          >
            <Lock size={16} /> Set Supervisor-Only ({selectedCells.length})
          </Button>
        )}
      </div>

      {/* Handsontable */}
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
        <HotTable ref={hotRef} settings={hotSettings} />
      </div>

      {/* Permission Legend */}
      <div className="mb-6 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Editable by Operators & Supervisors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 border-l-4 border-l-orange-500 rounded"></div>
          <span>Supervisor Only (click cells to set)</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-gray-200 flex justify-between">
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