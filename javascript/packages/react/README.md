# @adrenal-sdk/react

React components and hooks for Adrenal AI chatbots.

## Installation

```bash
npm install @adrenal-sdk/react
```

## Usage

### ChatbotWidget Component

The `ChatbotWidget` component adds the Adrenal chatbot widget to your React application:

```jsx
import { ChatbotWidget } from '@adrenal-sdk/react';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <ChatbotWidget publishId="your-publish-id" />
    </div>
  );
}
```

### useChatbot Hook

The `useChatbot` hook provides a programmatic way to interact with the chatbot:

```jsx
import { useChatbot } from '@adrenal-sdk/react';

function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages
  } = useChatbot({
    publishId: 'your-publish-id'
  });

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
        {isLoading && (
          <button onClick={stop}>Stop</button>
        )}
      </form>
    </div>
  );
}
```

## API Reference

### ChatbotWidget

#### Props

- `publishId` (string, required): The chatbot's publish ID
- `options` (object, optional): Additional configuration options

### useChatbot

#### Parameters

- `options` (object):
  - `publishId` (string, required): The chatbot's publish ID

#### Returns

- `messages` (array): Array of message objects with `role` and `content`
- `input` (string): Current input value
- `handleInputChange` (function): Input change handler
- `handleSubmit` (function): Form submit handler
- `isLoading` (boolean): Whether a response is being generated
- `stop` (function): Stop the current response generation
- `setMessages` (function): Update messages manually 