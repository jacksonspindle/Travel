import React, { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const Chat = ({ inputText, setInputText, selectedCountry }) => {
  const [typing, setTyping] = useState(false);
  // eslint-disable-next-line
  const [dalleImage, setDalleImage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `What would you like to know about ${selectedCountry}?`,
    },
  ]);

  const apiKey =
    process.env.REACT_APP_OPENAI_KEY ||
    "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"; // Replace with your API key if not using environment variable

  const sendMessageToAPI = async () => {
    const formattedMessages = messages.concat({
      role: "user",
      content: inputText,
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo", // or "gpt-3.5-turbo" or whichever model you're using
      messages: formattedMessages,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody), // Stringify the request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error("API request failed");
    }

    const data = await response.json();
    console.log(response);
    return (
      data.choices?.[0]?.message.content || "Sorry, I couldn't process that."
    );
  };

  const handleUserMessage = async () => {
    const userMessage = {
      role: "user",
      content: inputText,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");

    setTyping(true);

    try {
      const assistantReply = await sendMessageToAPI();
      const assistantMessage = {
        role: "assistant",
        content: assistantReply,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Failed to get a response from OpenAI:", error);
    }

    setTyping(false);
  };

  console.log(<MessageInput />);

  return (
    <MainContainer className="main-container">
      <ChatContainer className="chat-container">
        <MessageList
          className="message-list"
          typingIndicator={
            typing ? <TypingIndicator content="ChatGPT is typing" /> : null
          }
        >
          {messages.map((message, i) => (
            <Message
              key={i}
              model={{
                direction: message.role === "user" ? "outgoing" : "incoming", // <--- Add this line
                sender: message.role,
                content: message.content,
              }}
            >
              <Message.TextContent>{message.content}</Message.TextContent>
            </Message>
          ))}
          {dalleImage && (
            <Message model={{ direction: "incoming" }}>
              <Message.ImageContent
                src={dalleImage}
                alt="dalle Image"
                width={200}
              />
            </Message>
          )}
        </MessageList>
        <MessageInput
          attachButton={false}
          sendButton={false}
          placeholder="Ask anything..."
          value={inputText}
          onChange={(value) => setInputText(value)}
          onSend={() => handleUserMessage()}
          //   style={{ backgroundColor: "red !important" }}
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default Chat;
