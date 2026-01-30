interface ReportTimeProps {
    reportId: string;
}
const ReportTime = ({ reportId }: ReportTimeProps) => {
  return <div>Report Time Component for report ID: {reportId}</div>;
}
export default ReportTime;