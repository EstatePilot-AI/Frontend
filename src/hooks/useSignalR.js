import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (hubUrl, eventName, options = {}) => {
  const [connectionState, setConnectionState] = useState('disconnected');
  const connectionRef = useRef(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!hubUrl) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('authToken') ?? '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.onreconnecting(() => setConnectionState('reconnecting'));
    connection.onreconnected(() => setConnectionState('connected'));
    connection.onclose(() => {
      setConnectionState('disconnected');
      optionsRef.current.onDisconnected?.();
    });

    connection.on(eventName, (payload) => {
      optionsRef.current.onData?.(payload);
    });

    const startConnection = async () => {
      try {
        setConnectionState('connecting');
        await connection.start();
        setConnectionState('connected');
        optionsRef.current.onConnected?.();
      } catch (err) {
        setConnectionState('disconnected');
        optionsRef.current.onError?.(err);
        console.error('SignalR URL:', hubUrl);
        console.error('SignalR Error:', err?.message || err);
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

  return { connectionState, invoke };
};
