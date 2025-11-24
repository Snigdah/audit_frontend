import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import { Link, useNavigate } from "react-router-dom";


const NotificationsComponent = () => {
  const {
    notifications,
    toggleNotificationRead,
    deleteNotification,
    loadMore,
    hasMore,
  } = useNotification();
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await loadMore();
    setIsLoadingMore(false);
  };

  return (
    <div className="mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Notifications List */}
      <div className="min-h-[500px] bg-white">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-900 text-lg font-medium mb-2">No notifications</p>
            <p className="text-gray-500 text-sm text-center">When you get notifications, they'll show up here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.userNotificationId}
                className={`transition-all duration-200 hover:bg-blue-50 border-l-4 ${
                  !n.isRead 
                    ? "bg-blue-50 border-blue-500" 
                    : "bg-white border-transparent hover:border-blue-200"
                }`}
              >
                <div className="px-6 py-4">
                  <div className="flex items-start space-x-4">
                    {/* Avatar/Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      !n.isRead 
                        ? "bg-blue-500 shadow-lg shadow-blue-500/20" 
                        : "bg-gray-100"
                    }`}>
                      <svg className={`w-6 h-6 ${!n.isRead ? "text-white" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-base font-semibold ${
                            !n.isRead ? "text-gray-900" : "text-gray-700"
                          }`}>
                            {n.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                            {n.message}
                          </p>
                          
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-xs text-gray-500">
                              {n.createdAt &&
                                formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </span>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => toggleNotificationRead(n.userNotificationId)}
                                className={`text-xs font-medium transition-colors ${
                                  n.isRead 
                                    ? "text-blue-600 hover:text-blue-800" 
                                    : "text-green-600 hover:text-green-800"
                                }`}
                              >
                                {n.isRead ? "Mark as unread" : "Mark as read"}
                              </button>
                              
                              <button
                                onClick={() => deleteNotification(n.userNotificationId)}
                                className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                              >
                                Delete
                              </button>
                              
                              {n.redirectUrl && (
                                <Link
                                  to={n.redirectUrl}
                                  className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!n.isRead) {
                                      toggleNotificationRead(n.userNotificationId as any);
                                    }
                                  }}
                                >
                                  <span>View</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Unread Indicator */}
                        {!n.isRead && (
                          <div className="flex-shrink-0 ml-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
            >
              {isLoadingMore ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading notifications...</span>
                </>
              ) : (
                <>
                  <span>Load more notifications</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsComponent;