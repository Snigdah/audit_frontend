// src/pages/user/NotificationsPage.tsx
import PageHeader from "../../components/common/PageHeader";
import NotificationsComponent from "../../components/notification/NotificationsComponent";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Notifications"
        breadcrumbs={[{ label: "Notifications" }]}
      />

      <div className="pb-2">
        <NotificationsComponent />
      </div>
    </div>
  );
};

export default NotificationsPage;
