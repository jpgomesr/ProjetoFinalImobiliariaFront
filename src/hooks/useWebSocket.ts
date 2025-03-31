import { useState, useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
   data: string;
   type: string;
   target: WebSocket;
}

const useWebSocket = (socketUrl: string | null) => {
   const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(
      null
   );
   const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
   const webSocketRef = useRef<WebSocket | null>(null);
   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   // Função de limpeza que fecha o WebSocket e limpa os timeouts
   const cleanUp = useCallback(() => {
      if (reconnectTimeoutRef.current) {
         clearTimeout(reconnectTimeoutRef.current);
         reconnectTimeoutRef.current = null;
      }

      if (webSocketRef.current) {
         webSocketRef.current.close();
         webSocketRef.current = null;
      }
   }, []);

   // Configurar o WebSocket
   useEffect(() => {
      // Se não houver URL, não fazer nada
      if (!socketUrl) {
         console.log("Nenhum URL de WebSocket fornecido");
         return cleanUp;
      }

      // Função para conectar ao WebSocket
      const connect = () => {
         console.log(`Conectando ao WebSocket: ${socketUrl}`);
         cleanUp();

         try {
            const ws = new WebSocket(socketUrl);
            webSocketRef.current = ws;

            // Configurar handlers de eventos
            ws.onopen = () => {
               console.log(`WebSocket conectado: ${socketUrl}`);
               setReadyState(WebSocket.OPEN);
            };

            ws.onclose = (event) => {
               console.log(
                  `WebSocket fechado: ${socketUrl}, código: ${event.code}, razão: ${event.reason}`
               );
               setReadyState(WebSocket.CLOSED);

               // Configurar reconexão após 3 segundos
               reconnectTimeoutRef.current = setTimeout(() => {
                  console.log("Tentando reconectar WebSocket...");
                  connect();
               }, 3000);
            };

            ws.onerror = (error) => {
               console.error(`Erro de WebSocket: ${socketUrl}`, error);
               // Não tente reconectar aqui, deixe o onclose lidar com isso
            };

            ws.onmessage = (event) => {
               console.log(
                  `Mensagem WebSocket recebida: ${socketUrl}`,
                  event.data
               );
               const message = {
                  data: event.data,
                  type: event.type,
                  target: ws,
               };
               setLastMessage(message);
            };
         } catch (error) {
            console.error(`Erro ao criar WebSocket: ${socketUrl}`, error);
            // Tentar reconectar após 3 segundos
            reconnectTimeoutRef.current = setTimeout(() => {
               console.log("Tentando reconectar WebSocket após erro...");
               connect();
            }, 3000);
         }
      };

      // Iniciar conexão
      connect();

      // Limpar na desmontagem
      return cleanUp;
   }, [socketUrl, cleanUp]);

   // Função para enviar mensagens
   const sendMessage = useCallback(
      (message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
         if (
            webSocketRef.current &&
            webSocketRef.current.readyState === WebSocket.OPEN
         ) {
            webSocketRef.current.send(message);
            return true;
         }
         return false;
      },
      []
   );

   return {
      lastMessage,
      readyState,
      sendMessage,
   };
};

export default useWebSocket;
