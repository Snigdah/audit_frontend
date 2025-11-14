import PageHeader from "../../components/common/PageHeader";
import MyDepartment from "../../components/user/MyDepartment";
import ProfileInfo from "../../components/user/ProfileInfo";

const ProfilePage =()=>{
    return (
       <div className="min-h-screen">
      <PageHeader
        title="My Profile"
        breadcrumbs={[{ label: "User" }, { label: "My Profile" }]}
      />

        <div className="pb-2">
            <ProfileInfo />
        </div>
        <div className="pb-2">
            <MyDepartment />
        </div>
    </div>
    )
}

export default ProfilePage;