interface ChatMessageUpdate {
  type: 'sent' | 'received'; // Message type: sent (local) or received (remote)
  name: string; // Sender's name
  message: string; // The actual message content
}

export {ChatMessageUpdate}