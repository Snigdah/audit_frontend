interface ReportOverviewProps {
    reportId: string;
}

const ReportOverview = ({ reportId }: ReportOverviewProps) => {
    return (
        <div>
            <h1>This is report overview page for report ID: {reportId}</h1>
        </div>
    )
}

export default ReportOverview;