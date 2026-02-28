import { useState } from "react";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import SupervisorSubmissionModal from "../reportSubmission/SupervisorSubmissionModal";
import { useAuth } from "../../context/AuthContext";

interface ReportOverviewProps {
  reportId: string;
}

const ReportOverview = ({ reportId }: ReportOverviewProps) => {
  const { authState } = useAuth();
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  const canCreateSubmission =
    authState.role === "ADMIN" || authState.role === "SUPERVISOR";

  return (
    <div>
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Overview"
          rightContent={
            canCreateSubmission ? (
              <CustomButton
                onClick={() => setSubmissionModalOpen(true)}
                icon={<PlusOutlined />}
                className="bg-gray-800 hover:bg-gray-700 border-none text-white whitespace-nowrap"
              >
                Submission
              </CustomButton>
            ) : undefined
          }
        />
        <div className="text-sm text-gray-600">
          {canCreateSubmission
            ? "View report overview. Use the Submission button to create a new submission (Admin / Supervisor can edit any cell; structure changes are not allowed)."
            : "View report overview."}
        </div>
      </div>

      <SupervisorSubmissionModal
        reportId={Number(reportId)}
        open={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        onSuccess={() => {
          setSubmissionModalOpen(false);
        }}
      />
    </div>
  );
};

export default ReportOverview;
