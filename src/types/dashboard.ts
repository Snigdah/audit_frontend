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

/** Mirrors backend OperatorDashboardResponse */
export interface OperatorDashboardResponse {
  assignedEquipmentsCount: number | null;
  pendingSubmissionsCount: number | null;
  completedSubmissionsCount: number | null;
  missingSlotsCount: number | null;

  // today's slot breakdown for assigned departments
  todayAssignedDeptSlotApproved: number | null;
  todayAssignedDeptSlotPending: number | null;
  todayAssignedDeptSlotRejected: number | null;
  todayAssignedDeptSlotUpcoming: number | null;
  todayAssignedDeptSlotMissed: number | null;

  // monthly slot breakdown for assigned departments
  monthlyAssignedDeptSlotWithApprovedSubmission: number | null;
  monthlyAssignedDeptWithRejectedSubmission: number | null;
  monthlyAssignedDeptSlotWithPendingSubmission: number | null;
  monthlyAssignedDeptSlotWithUpcomingSubmission: number | null;
  monthlyAssignedDeptSlotWithMissedSubmission: number | null;
}

/** Mirrors backend OperatorReportDto */
export interface OperatorReportDto {
  reportId: number;
  reportName: string;
  equipmentName: string;
  time: string; // "HH:mm:ss"
  date: string; // ISO/string
  status: string; // PENDING | APPROVED | REJECTED | UPCOMING | MISSED | ...
}

/** Mirrors backend SupervisorDashboardResponse */
export interface SupervisorDashboardResponse {
  assignedDepartmentsCount: number | null;
  assignedEquipmentsCount: number | null;
  totalReportsCount: number | null;
  totalPendingSubmissionCount: number | null;

  // today's slot breakdown
  todaySlotCountApprovedSubmission: number | null;
  todaySlotCountPendingSubmission: number | null;
  todaySlotCountAllRejectedSubmission: number | null;
  todaySlotCountUpcomingSubmission: number | null;
  todaySlotCountMissedSubmission: number | null;

  // monthly slot breakdown
  monthlySlotWithApprovedSubmission: number | null;
  monthlySlotWithRejectedSubmission: number | null;
  monthlySlotWithPendingSubmission: number | null;
  monthlySlotWithUpcomingSubmission: number | null;
  monthlySlotWithMissedSubmission: number | null;
}
