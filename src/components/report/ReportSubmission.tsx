import ReportSlot from "../reportSubmission/ReportSlot";

interface ReportSubmissionProps {
    reportId: string;
}

const ReportSubmission = ({ reportId }: ReportSubmissionProps) => {
  return (
    <>
      <ReportSlot reportId={reportId} />
    </>
  )
}

export default ReportSubmission;