import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';


export const useSignalR = (hubUrl, eventName, options = {}) => {
  const [data, setData] = useState([]);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [lastUpdated, setLastUpdated] = useState(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    if (!hubUrl) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('authToken') ?? '',
      })
      .withAutomaticReconnect()
      .build();

    connection.onreconnecting(() => setConnectionState('reconnecting'));
    connection.onreconnected(() => setConnectionState('connected'));
    connection.onclose(() => {
      setConnectionState('disconnected');
      options.onDisconnected?.();
    });

    connection.on(eventName, (payload) => {
      setData(prev => Array.isArray(payload) ? payload : [...prev, payload]);
      setLastUpdated(new Date());
    });

    const startConnection = async () => {
      try {
        setConnectionState('connecting');
        await connection.start();
        setConnectionState('connected');
        options.onConnected?.();
      } catch (err) {
        setConnectionState('disconnected');
        options.onError?.(err);
        console.error('SignalR Connection Error:', err);
      }
    };

    connectionRef.current = connection;
    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [hubUrl, eventName]);

  const invoke = async (methodName, ...args) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return await connectionRef.current.invoke(methodName, ...args);
    }
    throw new Error('SignalR: Cannot invoke method while disconnected');
  };

  return { data, connectionState, invoke, lastUpdated };
};
