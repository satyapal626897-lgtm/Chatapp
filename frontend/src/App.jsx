import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import PinLogin from "./PinLogin";
import "./Ho.css";

const socket = io("http://localhost:8000");

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const chatRef = useRef(null);

  // 🔥 Single user fixed
  const user = "satya";

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      message,
      userId: user,
      time: getTime(),
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  if (!loggedIn) return <PinLogin onSuccess={() => setLoggedIn(true)} />;

  return (
    <div className="main-container">
      <h1>Chat App</h1>

      <div className="chat-card">
        <div className="chat-header">
          <div className="avatar">S</div>
          <span className="header-name">Satya</span>
          <div className="online-dot"></div>
        </div>

        <div className="chat-box" ref={chatRef}>
          {chat.map((msg, i) => (
            <div key={i} className="msg-group mine">
              <div className="message my-msg">
                {msg.message}
              </div>
              <span className="msg-time">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>
            <i className="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;