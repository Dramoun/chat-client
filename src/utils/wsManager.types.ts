export type HandShakeMessage = {
  type: "handshake";
  id: string;
  name: string;
};

export type ChatMessage = {
  type: "chat";
  id: string;
  name: string;
  message: string;
};

export type WSMessage = HandShakeMessage | ChatMessage;
