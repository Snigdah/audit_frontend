interface ReportSubmissionProps {
    reportId: string;
}

const ReportSubmission = ({ reportId }: ReportSubmissionProps) => {
  return <div>Report Submission Component for report ID: {reportId}</div>;
}

export default ReportSubmission;