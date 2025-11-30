import { useLocation } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import UserProfileInfo from "../../components/user/UserProfileInfo";

const UserProfilePage = () =>{
    const location = useLocation();
    const { employeeId } = location.state as { employeeId: string }; // type assertion

    return(
        <div className="min-h-screen">
            <PageHeader
                title="User Profile"
                breadcrumbs={[{ label: "User Profile" }]}
            />

            <div className="pb-2">
                 <UserProfileInfo employeeId={employeeId} />
            </div>
        </div>
    )
}

export default UserProfilePage;