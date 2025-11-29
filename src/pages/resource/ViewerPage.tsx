import PageHeader from "../../components/common/PageHeader";
import ViewerList from "../../components/viewer/ViewerList";

const ViewerPage = () =>{
    return(
        <div className="min-h-screen">
            <PageHeader
                title="Operator"
                breadcrumbs={[{ label: "Resource" }, { label: "Viewer" }]}
            />
            <ViewerList />
        </div>
    )
}

export default ViewerPage;