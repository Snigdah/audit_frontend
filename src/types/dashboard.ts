/** Mirrors backend AdminDashboardResponse */
export interface AdminDashboardResponse {
  totalActiveDepartments: number | null;
  totalActiveEquipments: number | null;
  totalActiveReports: number | null;
  totalPendingTemplates: number | null;
  totalPendingStructureChangeRequests: number | null;
  totalApprovedTemplate: number | null;
  totalPendingTemplate: number | null;
  totalRejectedTemplate: number | null;
  monthlySlotWithApprovedSubmission: number | null;
  monthlySlotWithRejectedSubmission: number | null;
  monthlySlotWithPendingSubmission: number | null;
  monthlySlotWithUpcomingSubmission: number | null;
  monthlySlotWithMissedSubmission: number | null;
}
