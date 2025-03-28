// components/WebSocketIntegration.tsx
import { useContext, useEffect, useRef } from "react";
import { websocketService } from "../services/websocket";
import { DocumentContext } from "../context/DocumentContext";

type WebSocketIntegrationProps = {
  documentId: string;
  children: React.ReactNode;
};

const WebSocketIntegration = ({
  documentId,
  children,
}: WebSocketIntegrationProps) => {
  const context = useContext(DocumentContext);
  const initializedRef = useRef(false);

  if (!context) {
    throw new Error("DocumentContext is not provided");
  }

  const { updateContent } = context;

  useEffect(() => {
    // Ensure we only initialize once per mount
    if (!initializedRef.current) {
      initializedRef.current = true;

      // Connect to WebSocket with a small delay to ensure everything is ready
      websocketService.connect(documentId);

      const cleanup = websocketService.addMessageHandler((data) => {
        if (data.type === "content_update") {
          updateContent(data.content);
        }
      });

      return () => {
        cleanup();
        websocketService.disconnect();
        initializedRef.current = false;
      };
    }
  }, [documentId, updateContent]);

  return children;
};

export default WebSocketIntegration;
