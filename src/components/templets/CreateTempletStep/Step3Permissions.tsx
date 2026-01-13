// ============================================
// Step3Permissions.tsx
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

  const isCellInMerge = (row: number, col: number): { isMerged: boolean; mainCell?: {row: number, col: number} } => {
    const mergeCells = localStructure.mergeCells || [];
    for (const merge of mergeCells) {
      if (row >= merge.row && row < merge.row + merge.rowspan &&
          col >= merge.col && col < merge.col + merge.colspan) {
        return { isMerged: true, mainCell: { row: merge.row, col: merge.col } };
      }
    }
    return { isMerged: false };
  };

  const handleCellClick = (row: number, col: number): void => {
    const mergeInfo = isCellInMerge(row, col);
    const targetRow = mergeInfo.mainCell?.row ?? row;
    const targetCol = mergeInfo.mainCell?.col ?? col;
    
    if (mergeInfo.isMerged) {
      const mergeCells = localStructure.mergeCells || [];
      const merge = mergeCells.find(
        m => m.row === mergeInfo.mainCell!.row && m.col === mergeInfo.mainCell!.col
      );
      
      if (merge) {
        const mergeCellsList: Array<{row: number, col: number}> = [];
        for (let r = merge.row; r < merge.row + merge.rowspan; r++) {
          for (let c = merge.col; c < merge.col + merge.colspan; c++) {
            mergeCellsList.push({ row: r, col: c });
          }
        }
        
        const allSelected = mergeCellsList.every(cell => 
          selectedCells.some(sc => sc.row === cell.row && sc.col === cell.col)
        );
        
        if (allSelected) {
          setSelectedCells(selectedCells.filter(sc => 
            !mergeCellsList.some(mc => mc.row === sc.row && mc.col === sc.col)
          ));
        } else {
          const newSelected = [...selectedCells];
          mergeCellsList.forEach(cell => {
            if (!newSelected.some(sc => sc.row === cell.row && sc.col === cell.col)) {
              newSelected.push(cell);
            }
          });
          setSelectedCells(newSelected);
        }
        return;
      }
    }
    
    const exists = selectedCells.some(c => c.row === targetRow && c.col === targetCol);
    
    if (exists) {
      setSelectedCells(selectedCells.filter(c => !(c.row === targetRow && c.col === targetCol)));
    } else {
      setSelectedCells([...selectedCells, { row: targetRow, col: targetCol }]);
    }
  };

  const setSupervisorOnly = (): void => {
    const newPermissions = localStructure.permissions.map(row => row.map(cell => [...cell]));
    
    selectedCells.forEach(({ row, col }) => {
      if (newPermissions[row]?.[col]) {
        newPermissions[row][col] = ["admin", "supervisor"];
      }
    });

    setLocalStructure({ ...localStructure, permissions: newPermissions });
    setSelectedCells([]);
  };

  const handleNext = (): void => {
    onNext(localStructure);
  };

  const getCellDisplay = (row: number, col: number): { display: boolean; value: string } => {
    const mergeCells = localStructure.mergeCells || [];
    for (const merge of mergeCells) {
      if (row >= merge.row && row < merge.row + merge.rowspan &&
          col >= merge.col && col < merge.col + merge.colspan) {
        if (row === merge.row && col === merge.col) {
          return { display: true, value: localStructure.data[row][col] || '' };
        }
        return { display: false, value: '' };
      }
    }
    return { display: true, value: localStructure.data[row][col] || '' };
  };

  const getCellSpan = (row: number, col: number): { rowSpan: number; colSpan: number } => {
    const mergeCells = localStructure.mergeCells || [];
    const merge = mergeCells.find(m => m.row === row && m.col === col);
    if (merge) {
      return { rowSpan: merge.rowspan, colSpan: merge.colspan };
    }
    return { rowSpan: 1, colSpan: 1 };
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Set Cell Permissions</h2>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Click cells to select them, then click "Set Supervisor-Only" to restrict editing. 
          By default, all cells can be edited by Operators and Supervisors.
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button 
          onClick={() => setSelectedCells([])}
          disabled={selectedCells.length === 0}
          className="border border-gray-300 hover:bg-gray-50"
        >
          Clear ({selectedCells.length})
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

      <div className="mb-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border-2 border-green-400"></div>
          <span>Operator & Supervisor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-50 border-2 border-orange-400"></div>
          <span>Supervisor Only</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border-2 border-blue-500"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-auto mb-6 shadow-sm" style={{ maxHeight: '550px' }}>
        <table className="w-full border-collapse min-w-full">
          <tbody>
            {localStructure.data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => {
                  const cellDisplay = getCellDisplay(rowIdx, colIdx);
                  if (!cellDisplay.display) return null;

                  const cellSpan = getCellSpan(rowIdx, colIdx);
                  const isSelected = selectedCells.some(c => c.row === rowIdx && c.col === colIdx);
                  const isSupervisorOnly = !localStructure.permissions[rowIdx]?.[colIdx]?.includes("operator");

                  return (
                    <td
                      key={colIdx}
                      rowSpan={cellSpan.rowSpan}
                      colSpan={cellSpan.colSpan}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      className={`border-2 p-4 cursor-pointer transition-colors min-w-[120px] ${
                        isSelected ? 'bg-blue-200 border-blue-500' : 
                        isSupervisorOnly ? 'bg-orange-50 border-orange-300' : 
                        'bg-white hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{cellDisplay.value}</span>
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

      <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between text-sm">
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

export default Step3Permissions;