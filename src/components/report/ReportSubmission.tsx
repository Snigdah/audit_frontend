import ReportSlot from "../reportSubmission/ReportSlot";

interface ReportSubmissionProps {
    reportId: string;
    templateVersionId?: number;
}

const ReportSubmission = ({ reportId, templateVersionId }: ReportSubmissionProps) => {
  return (
    <>
      <ReportSlot reportId={reportId} templateVersionId={templateVersionId} />
    </>
  )
}

export default ReportSubmission;