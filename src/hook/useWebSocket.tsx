import { Client, type IMessage } from '@stomp/stompjs';
import { useEffect } from 'react';
import AuthService from '../services/AuthService';

export const useWebSocket = (userId: string, onMessage: (msg: IMessage) => void) => {
  const token = AuthService.getAccessToken();

  useEffect(() => {
    const client = new Client({
      brokerURL: 'http://localhost:8080/ws', // use wss:// in production
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });

    client.onConnect = () => {
      console.log('Connected');
      client.subscribe(`/topic/notifications/${userId}`, (msg) => onMessage(msg));
    };

    client.activate();

    // Cleanup
    return () => {
      client.deactivate().catch((err) => console.error('WS disconnect error', err));
    };
  }, [userId, onMessage, token]);
};
