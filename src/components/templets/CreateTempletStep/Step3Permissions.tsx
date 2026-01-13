// ============================================
// Step3Permissions.tsx - NEW FILE
// ============================================
import React, { useState } from "react";
import { Button } from "antd";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import type { TemplateStructureRequest } from "../../../types/template";
import CustomButton from "../../common/CustomButton";

interface Step3PermissionsProps {
  structure: TemplateStructureRequest;
  onBack: () => void;
  onNext: (updatedStructure: TemplateStructureRequest) => void;
}

const Step3Permissions: React.FC<Step3PermissionsProps> = ({ 
  structure, 
  onBack, 
  onNext 
}) => {
  const [selectedCells, setSelectedCells] = useState<Array<{row: number, col: number}>>([]);
  const [localStructure, setLocalStructure] = useState<TemplateStructureRequest>(structure);

  const handleCellClick = (row: number, col: number): void => {
    const exists = selectedCells.some(c => c.row === row && c.col === col);
    
    if (exists) {
      setSelectedCells(selectedCells.filter(c => !(c.row === row && c.col === col)));
    } else {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const setSupervisorOnly = (): void => {
    const newPermissions = localStructure.permissions.map(row => row.map(cell => [...cell]));
    
    selectedCells.forEach(({ row, col }) => {
      if (newPermissions[row]?.[col]) {
        newPermissions[row][col] = ["admin", "supervisor"];
      }
    });

    const updatedStructure = { ...localStructure, permissions: newPermissions };
    setLocalStructure(updatedStructure);
    setSelectedCells([]);
  };

  const setAllOperators = (): void => {
    const newPermissions = localStructure.permissions.map(row => 
      row.map(() => ["admin", "supervisor", "operator"])
    );

    const updatedStructure = { ...localStructure, permissions: newPermissions };
    setLocalStructure(updatedStructure);
    setSelectedCells([]);
  };

  const handleNext = (): void => {
    onNext(localStructure);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Set Cell Permissions</h2>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Click on cells to select them, then choose a permission level.
          By default, all cells are editable by both Operators and Supervisors.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button 
          onClick={() => setSelectedCells([])}
          disabled={selectedCells.length === 0}
          className="border border-gray-300 hover:bg-gray-50"
        >
          Clear Selection ({selectedCells.length})
        </Button>
        
        <Button 
          onClick={setAllOperators}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Allow All for Operators
        </Button>
        
        {selectedCells.length > 0 && (
          <Button 
            onClick={setSupervisorOnly}
            className="bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1"
          >
            <Lock size={16} /> Set Supervisor-Only ({selectedCells.length})
          </Button>
        )}
      </div>

      {/* Permission Legend */}
      <div className="mb-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300"></div>
          <span>Operator & Supervisor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300"></div>
          <span>Supervisor Only</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Permission Grid */}
      <div className="border border-gray-300 rounded-lg overflow-auto mb-6 max-h-96">
        <table className="w-full border-collapse">
          <tbody>
            {localStructure.data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => {
                  const isSelected = selectedCells.some(c => c.row === rowIdx && c.col === colIdx);
                  const isSupervisorOnly = !localStructure.permissions[rowIdx]?.[colIdx]?.includes("operator");

                  return (
                    <td
                      key={colIdx}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      className={`border p-3 cursor-pointer ${isSelected ? 'bg-blue-100' : isSupervisorOnly ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">{cell || '(empty)'}</span>
                        {isSupervisorOnly && <Lock size={14} className="text-orange-500 flex-shrink-0" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-600">Total Cells: </span>
            <span className="font-medium">{localStructure.data.flat().length}</span>
          </div>
          <div>
            <span className="text-gray-600">Operator Editable: </span>
            <span className="font-medium text-green-600">
              {localStructure.permissions.flat().filter(p => p.includes("operator")).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Supervisor Only: </span>
            <span className="font-medium text-orange-600">
              {localStructure.permissions.flat().filter(p => !p.includes("operator")).length}
            </span>
          </div>
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

export default Step3Permissions;