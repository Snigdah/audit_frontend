import { formatDistanceToNow } from "date-fns";
import { useNotification } from "../../context/NotificationContext";

const NotificationsComponent = () => {
  const {
    notifications,
    toggleNotificationRead,
    markAllRead,
    deleteNotification, 
  } = useNotification();

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          type="button"
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
            className={`border p-3 rounded ${
              !n.isRead ? "bg-blue-50" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-1">{n.message}</div>

            <div className="flex justify-between mt-2 text-sm space-x-2">
              <button
                type="button"
                onClick={() => toggleNotificationRead(n.userNotificationId)}
                className="text-blue-500"
              >
                {n.isRead ? "Mark as unread" : "Mark as read"}
              </button>

             <button
                onClick={() => deleteNotification(n.userNotificationId)}
                className="text-red-500"
              >
                Delete
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

export default NotificationsComponent;
