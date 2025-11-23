import { useNotification } from "../../context/NotificationContext";

const NotificationsPage = () => {
  const {
    notifications,
    toggleNotificationRead,
    markAllRead,
  } = useNotification();

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <button
          onClick={markAllRead}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.userNotificationId}
            className={`border p-4 rounded ${
              !n.isRead ? "bg-blue-50" : "bg-white"
            }`}
          >
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-600">{n.message}</div>

            <div className="flex justify-between mt-2 text-sm">
              <button
                onClick={() => toggleNotificationRead(n.userNotificationId)}
                className="text-blue-500"
              >
                {n.isRead ? "Mark as unread" : "Mark as read"}
              </button>

              {n.redirectUrl && (
                <a
                  href={n.redirectUrl}
                  className="text-gray-500 underline"
                >
                  Open
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
