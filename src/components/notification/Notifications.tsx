import React, { useState } from 'react';
import { useWebSocket } from '../../hook/useWebSocket';
import { USER_ID_KEY } from '../../constants/config';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Suppose you get userId from localStorage
  const userId = localStorage.getItem(USER_ID_KEY);

  useWebSocket(userId || '', (message) => {
    console.log('Received notification:', message); // this should appear in console
    setNotifications((prev) => [...prev, message]);
  });

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>{JSON.stringify(n)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
