import React, { useState, useRef } from 'react';

interface InputSectionProps {
  sendMessage: (message: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ sendMessage }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to auto to calculate new height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scrollHeight
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey || event.ctrlKey) {
        // Create a new line when Shift+Enter or Ctrl+Enter is pressed
        event.preventDefault();
        setInputValue((prev) => prev + '\n');
      } else {
        // Send the message when Enter is pressed
        event.preventDefault();
        if (inputValue.trim()) {
          sendMessage(inputValue.trim());
          setInputValue(''); // Clear the input field
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height after sending
          }
        }
      }
    }
  };

  return (
    <div className="input-section">
      <textarea
        ref={textareaRef}
        className="chat-input"
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onInput={handleInput} // Adjust height dynamically
        onKeyDown={handleKeyDown}
        rows={1} // Default rows
      />
      <button
        className="send-button"
        onClick={() => {
          if (inputValue.trim()) {
            sendMessage(inputValue.trim());
            setInputValue(''); // Clear the input field
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto'; // Reset height after sending
            }
          }
        }}
      >
        Send
      </button>
    </div>
  );
};

export default InputSection;