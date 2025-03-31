import React, { useEffect, useState, JSX } from 'react';
import { InputSection, ChatHistory, LoadingOverlay } from './components';
import { WSManager } from './utils/wsManager';
import { HandShakeMessage, ChatMessage } from './utils/wsManager.types';
import { ChatMessageUpdate } from './components/types/types';

const App = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('User');
  const [id_, setID] = useState<string>('XXX');
  const [messages, setMessages] = useState<ChatMessageUpdate[]>([]);
  const [wsManager, setWsManager] = useState<WSManager | null>(null);

  useEffect(() => {
    console.log('Initializing WSManager...');
    const ws = new WSManager('localhost', 3333, handleChatMessage, handleHandshakeMessage, handleWsError);
    setWsManager(ws);
    
  }, []);

  const handleChatMessage = (message: ChatMessage) => {
    handleReceiveMessage(message.id, message.name, message.message);
  };

  const handleHandshakeMessage = (message: HandShakeMessage) => {
    const formattedMessage: ChatMessageUpdate = {
      type: 'received',
      name: 'System', // System message
      message: `Connected as ${message.name}`,
    };
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    setUserName(message.name);
    setID(message.id);
    setIsLoading(false); // Hide the loading overlay once connected
  };

  const handleWsError = (error: Event) => {
    const errorMessage = (error as ErrorEvent).message || 'An unknown error occurred';
    const formattedMessage: ChatMessageUpdate = {
      type: 'received',
      name: 'System', // System message
      message: `System error: ${errorMessage}`,
    };
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);
  };

  const handleSendMessage = (message: string) => {
    const formattedMessage: ChatMessageUpdate = {
      type: 'sent',
      name: userName, // Local user's name
      message: message, // Message content
    };
    wsManager?.sendChatMessage(message);
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);
  };

  const handleReceiveMessage = (id: string, user: string, message: string) => {
    if (id !== id_) {
      const formattedMessage: ChatMessageUpdate = {
        type: 'received',
        name: user, // Sender's name
        message: message, // Message content
      };
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    }
  };

  return (
    <div className="chat-window">
      <LoadingOverlay visible={isLoading} />
      <ChatHistory messages={messages} />
      <InputSection sendMessage={handleSendMessage} />
    </div>
  );
};

export default App;