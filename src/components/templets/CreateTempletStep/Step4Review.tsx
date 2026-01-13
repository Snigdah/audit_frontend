// ============================================
// Step4Review.tsx
// ============================================
import React from "react";
import { Button } from "antd";
import { ArrowLeft, Save, CheckCircle, AlertCircle, FileText, Lock } from "lucide-react";
import type { 
  TemplateMetaForm, 
  TemplateStructureRequest 
} from "../../../types/template";
import CustomButton from "../../common/CustomButton";

interface Step4ReviewProps {
  meta: TemplateMetaForm;
  structure: TemplateStructureRequest;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const Step4Review: React.FC<Step4ReviewProps> = ({ 
  meta, 
  structure, 
  onBack, 
  onSubmit, 
  isSubmitting 
}) => {
  const getCellDisplay = (row: number, col: number): { display: boolean; value: string; rowSpan: number; colSpan: number } => {
    const mergeCells = structure.mergeCells || [];
    for (const merge of mergeCells) {
      if (row >= merge.row && row < merge.row + merge.rowspan &&
          col >= merge.col && col < merge.col + merge.colspan) {
        if (row === merge.row && col === merge.col) {
          return { 
            display: true, 
            value: structure.data[row][col] || '',
            rowSpan: merge.rowspan,
            colSpan: merge.colspan
          };
        }
        return { display: false, value: '', rowSpan: 1, colSpan: 1 };
      }
    }
    return { 
      display: true, 
      value: structure.data[row][col] || '',
      rowSpan: 1,
      colSpan: 1
    };
  };

  const mergeCount = structure.mergeCells?.length || 0;

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Review & Submit</h2>
      
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle size={22} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-800">Ready to Submit</h3>
            <p className="text-green-700 text-sm mt-1">
              Review all details below before submitting for admin approval.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FileText size={18} /> Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-600">Template Name</label>
            <p className="font-medium">{meta.templateName}</p>
          </div>
          <div>
            <label className="text-gray-600">Description</label>
            <p className="font-medium">{meta.description || "No description"}</p>
          </div>
          <div>
            <label className="text-gray-600">Department ID</label>
            <p className="font-medium">{meta.departmentId}</p>
          </div>
          <div>
            <label className="text-gray-600">Equipment ID</label>
            <p className="font-medium">{meta.equipmentId}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-2">
        <h3 className="font-semibold text-gray-800 mb-3">Structure Preview</h3>
        
        <div className="mb-3 text-sm text-gray-600">
          {structure.data.length} rows × {structure.data[0]?.length || 0} columns
          {mergeCount > 0 && ` • ${mergeCount} merged cells`}
        </div>

        <div className="mb-3 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-400"></div>
            <span>Operator & Supervisor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-50 border-2 border-orange-400"></div>
            <span>Supervisor Only</span>
          </div>
        </div>
        {/* <div className="border border-gray-300 rounded overflow-auto shadow-sm" style={{ maxHeight: '450px' }}>
  <table className="w-full border-collapse font-sans text-sm">
    <tbody>
      {structure.data.map((row, rowIdx) => (
        <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
          {row.map((cell, colIdx) => {
            const cellInfo = getCellDisplay(rowIdx, colIdx);
            if (!cellInfo.display) return null;

            const isSupervisorOnly = !structure.permissions[rowIdx]?.[colIdx]?.includes("operator");

            return (
              <td
                key={colIdx}
                rowSpan={cellInfo.rowSpan}
                colSpan={cellInfo.colSpan}
                className={`border border-gray-300 p-1 text-left align-middle`}
                style={{
                  backgroundColor: isSupervisorOnly ? '#FFF3E0' : 'white',
                }}
              >
                <span>{cellInfo.value}</span>
                {isSupervisorOnly && (
                  <Lock size={14} className="text-orange-600 inline ml-1" />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
</div> */}

        <div className="border-2 border-gray-200 rounded-lg overflow-auto shadow-sm" style={{ maxHeight: '450px' }}>
          <table className="w-full border-collapse min-w-full">
            <tbody>
              {structure.data.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => {
                    const cellInfo = getCellDisplay(rowIdx, colIdx);
                    if (!cellInfo.display) return null;

                    const isSupervisorOnly = !structure.permissions[rowIdx]?.[colIdx]?.includes("operator");

                    return (
                      <td
                        key={colIdx}
                        rowSpan={cellInfo.rowSpan}
                        colSpan={cellInfo.colSpan}
                        className={`border-2 p-4 text-sm font-medium min-w-[120px] ${
                          isSupervisorOnly ? 'bg-orange-50 border-orange-300' : 'bg-green-50 border-green-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{cellInfo.value}</span>
                          {isSupervisorOnly && (
                            <Lock size={14} className="text-orange-600 flex-shrink-0" />
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
          <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notice</h4>
            <p className="text-yellow-700 text-sm mt-1">
              This template will be submitted for admin approval. You will be notified once approved.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-between">
        <Button
          onClick={onBack}
          disabled={isSubmitting}
          className="border border-gray-300 hover:bg-gray-50"
          size="large"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        
        <CustomButton
          onClick={onSubmit}
          loading={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="large"
        >
          <Save size={18} className="mr-2" /> Submit for Approval
        </CustomButton>
      </div>
    </div>
  );
};

export default Step4Review;