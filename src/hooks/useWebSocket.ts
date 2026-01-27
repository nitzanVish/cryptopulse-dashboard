/**
 * useWebSocket Hook
 * 
 * Manages WebSocket lifecycle with auto-reconnect and exponential backoff.
 * Handles React StrictMode double-mounting and prevents race conditions.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createBinanceWebSocket } from '@/services/websocket';

interface UseWebSocketReturn {
  isConnected: boolean;
}

const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const RECONNECT_MULTIPLIER = 2;

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  // ReturnType<typeof setTimeout> for cross-platform compatibility
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const shouldReconnectRef = useRef(true);
  const isConnectingRef = useRef(false);

  /**
   * Connects to Binance WebSocket
   */
  const connect = useCallback(() => {
    const currentState = wsRef.current?.readyState;
    if (
      currentState === WebSocket.OPEN ||
      currentState === WebSocket.CONNECTING ||
      isConnectingRef.current ||
      !shouldReconnectRef.current
    ) {
      return;
    }

    isConnectingRef.current = true;
    wsRef.current = null;

    try {
      // Event handlers: onMessage (reset delay), onError (update state), onClose (reconnect)
      const ws = createBinanceWebSocket(
        () => {
          // onMessage: successful message received, reset reconnect delay
          reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
        },
        () => {
          // onError: connection error occurred, update state
          setIsConnected(false);
        },
        (event) => {
          // onClose: connection closed, attempt auto-reconnect if not manual close
          setIsConnected(false);
          isConnectingRef.current = false;
          
          // Auto-reconnect with exponential backoff
          if (shouldReconnectRef.current && event.code !== 1000) {
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectDelayRef.current = Math.min(
                reconnectDelayRef.current * RECONNECT_MULTIPLIER,
                MAX_RECONNECT_DELAY
              );
              connect();
            }, reconnectDelayRef.current);
          }
        }
      );

      ws.onopen = () => {
        setIsConnected(true);
        isConnectingRef.current = false;
        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
      };

      ws.onerror = () => {
        isConnectingRef.current = false;
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
      isConnectingRef.current = false;
      
      if (shouldReconnectRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectDelayRef.current = Math.min(
            reconnectDelayRef.current * RECONNECT_MULTIPLIER,
            MAX_RECONNECT_DELAY
          );
          connect();
        }, reconnectDelayRef.current);
      }
    }
  }, []);

  // Empty deps: connect is stable (useCallback), prevents StrictMode double-connect
  useEffect(() => {
    connect();

    return () => {
      shouldReconnectRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Only close if OPEN or CLOSING (prevents closing CONNECTING state in StrictMode)
      if (wsRef.current) {
        const currentState = wsRef.current.readyState;
        if (currentState === WebSocket.OPEN || currentState === WebSocket.CLOSING) {
          wsRef.current.close(1000, 'Manual disconnect');
        }
        wsRef.current = null;
      }
      
      setIsConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConnected,
  };
}
