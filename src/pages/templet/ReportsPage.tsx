import PageHeader from "../../components/common/PageHeader";
import ReportList from "../../components/report/ReportList";

const ReportPage = () => {
    return(
        <div className="min-h-screen">
            <PageHeader
                title="Reports"
                breadcrumbs={[{ label: "Report" }, { label: "Reports" }]}
            />
           <ReportList />
        </div>
    )
}

export default ReportPage;