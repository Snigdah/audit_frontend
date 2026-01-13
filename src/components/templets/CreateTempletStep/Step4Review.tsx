// ============================================
// Step4Review.tsx - RENAMED from Step3Review.tsx
// ============================================
import React from "react";
import { Button } from "antd";
import { ArrowLeft, Save, CheckCircle, AlertCircle, FileText, Users, Lock } from "lucide-react";
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
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Review & Submit</h2>
      
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">Ready to Create Template</h3>
            <p className="text-green-700 text-sm mt-1">
              Review all details below before submitting. The template will be sent for admin approval.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info Review */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={18} /> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Template Name</label>
            <p className="font-medium">{meta.templateName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <p className="font-medium">{meta.description || "No description provided"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Department ID</label>
            <p className="font-medium">{meta.departmentId}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Equipment ID</label>
            <p className="font-medium">{meta.equipmentId}</p>
          </div>
        </div>
      </div>

      {/* Structure Preview */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Structure Preview</h3>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Dimensions: {structure.data.length} rows × {structure.data[0]?.length || 0} columns</span>
            <span>•</span>
            <span>Merged Cells: {structure.mergeCells?.length || 0}</span>
          </div>
          
          {/* Simple table preview */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {structure.data[0]?.map((header: string, index: number) => (
                      <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header || `Column ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {structure.data.slice(1).map((row: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell: any, cellIndex: number) => {
                        const isSupervisorOnly = !structure.permissions[rowIndex + 1]?.[cellIndex]?.includes("operator");
                        return (
                          <td key={cellIndex} className={`px-3 py-2 text-sm ${
                            isSupervisorOnly ? 'bg-orange-50' : ''
                          }`}>
                            {cell || "(empty)"}
                            {isSupervisorOnly && (
                              <span className="ml-2 text-xs text-orange-600">
                                <Lock size={12} className="inline" />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Permission Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Permission Summary</span>
          </div>
          <div className="text-sm text-blue-700">
            <p>• {
              structure.data.flat().filter((_, i: number, arr: any[]) => {
                const colCount = structure.data[0]?.length || 1;
                const row = Math.floor(i / colCount);
                const col = i % colCount;
                return structure.permissions[row]?.[col]?.includes("operator");
              }).length
            } cells editable by Operators & Supervisors</p>
            <p>• {
              structure.data.flat().filter((_, i: number, arr: any[]) => {
                const colCount = structure.data[0]?.length || 1;
                const row = Math.floor(i / colCount);
                const col = i % colCount;
                return !structure.permissions[row]?.[col]?.includes("operator");
              }).length
            } cells restricted to Supervisors only</p>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notice</h4>
            <p className="text-yellow-700 text-sm mt-1">
              This template will be submitted for admin approval. No changes can be made until it's approved.
              You will be notified once the template is approved and ready for use.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-gray-200 flex justify-between">
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