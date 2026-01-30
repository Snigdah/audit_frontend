interface ReportHistoryProps {
    reportId: string;
}

const ReportHistory = ({ reportId }: ReportHistoryProps) => {
  return <div>Report History Component for report ID: {reportId}</div>;
}

export default ReportHistory;