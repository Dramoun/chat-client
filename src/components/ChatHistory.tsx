import React from 'react';
import { ChatMessageUpdate } from './types/types';

interface ChatHistoryProps {
  messages: ChatMessageUpdate[]; // Array of messages with type, name, and message
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <div className="chat-history">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`chat-message ${message.type}`} // Apply sent or received class
        >
          {/* Highlight the name */}
          <div className="chat-name">{message.name}</div>
          {/* Render the message with new lines preserved */}
          <div className="chat-text">
            {message.message.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;